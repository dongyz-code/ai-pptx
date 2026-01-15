import { Injectable, Logger, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity, UserStatus } from './entities/user.entity.js';
import { RoleEntity } from '../role/entities/role.entity.js';
import { CreateUserDto, UpdateUserDto, QueryUserDto, UserResponseDto, ChangePasswordDto } from './dto/user.dto.js';
import { PaginatedResponse } from '../../common/dto/response.dto.js';
import { CacheService } from '../../common/cache/cache.service.js';
import { IdService } from '../redis/id.service.js';

/**
 * 用户服务 - 用户管理业务逻辑
 */
@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  private readonly CACHE_PREFIX = 'user';
  private readonly CACHE_TTL = 300; // 5分钟

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly cacheService: CacheService,
    private readonly idService: IdService
  ) {}

  async onModuleInit() {
    // 初始化默认管理员
    await this.initDefaultAdmin();
  }

  private async initDefaultAdmin() {
    const adminExists = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const adminRole = await this.roleRepository.findOne({ where: { code: 'admin' } });
      const admin = this.userRepository.create({
        id: 'admin-001',
        username: 'admin',
        password: this.hashPassword('admin123'),
        nickname: '系统管理员',
        email: 'admin@example.com',
        status: UserStatus.ACTIVE,
        roles: adminRole ? [adminRole] : [],
      });
      await this.userRepository.save(admin);
      this.logger.log('默认管理员用户已初始化');
    }
  }

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const id = await this.idService.nextId({ prefix: 'user-' });

    // 获取角色
    let roles: RoleEntity[] = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      roles = await this.roleRepository.findByIds(createUserDto.roleIds);
    }

    const user = this.userRepository.create({
      id,
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
      status: createUserDto.status || UserStatus.ACTIVE,
      roles,
    });

    await this.userRepository.save(user);
    this.logger.log(`用户 ${user.username} 创建成功`);

    return this.toResponseDto(user);
  }

  /**
   * 查询用户列表（分页）
   */
  async findAll(query: QueryUserDto): Promise<PaginatedResponse<UserResponseDto>> {
    const { page = 1, pageSize = 10, username, nickname, status } = query;

    const where: any = {};
    if (username) where.username = Like(`%${username}%`);
    if (nickname) where.nickname = Like(`%${nickname}%`);
    if (status) where.status = status;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations: ['roles'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const list = users.map((u) => this.toResponseDto(u));
    return new PaginatedResponse(list, total, page, pageSize);
  }

  /**
   * 根据ID查询用户（带缓存）
   */
  async findOne(id: string): Promise<UserResponseDto> {
    return this.cacheService.getOrSet(
      `${this.CACHE_PREFIX}:${id}`,
      async () => {
        const user = await this.userRepository.findOne({
          where: { id },
          relations: ['roles'],
        });
        if (!user) {
          throw new NotFoundException('用户不存在');
        }
        return this.toResponseDto(user);
      },
      this.CACHE_TTL
    );
  }

  /**
   * 根据用户名查询用户（含密码，用于登录验证）
   */
  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  /**
   * 更新用户
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新角色
    if (updateUserDto.roleIds) {
      user.roles = await this.roleRepository.findByIds(updateUserDto.roleIds);
    }

    // 更新其他字段
    if (updateUserDto.password) {
      user.password = this.hashPassword(updateUserDto.password);
    }
    Object.assign(user, {
      nickname: updateUserDto.nickname ?? user.nickname,
      email: updateUserDto.email ?? user.email,
      phone: updateUserDto.phone ?? user.phone,
      avatar: updateUserDto.avatar ?? user.avatar,
      status: updateUserDto.status ?? user.status,
      remark: updateUserDto.remark ?? user.remark,
    });

    await this.userRepository.save(user);

    // 清除缓存
    await this.cacheService.del(`${this.CACHE_PREFIX}:${id}`);
    await this.cacheService.del(`${this.CACHE_PREFIX}:${id}:permissions`);

    this.logger.log(`用户 ${user.username} 更新成功`);
    return this.toResponseDto(user);
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.remove(user);

    // 清除缓存
    await this.cacheService.del(`${this.CACHE_PREFIX}:${id}`);
    await this.cacheService.del(`${this.CACHE_PREFIX}:${id}:permissions`);

    this.logger.log(`用户 ${user.username} 删除成功`);
  }

  /**
   * 修改密码
   */
  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.password !== this.hashPassword(dto.oldPassword)) {
      throw new ConflictException('旧密码错误');
    }

    user.password = this.hashPassword(dto.newPassword);
    await this.userRepository.save(user);

    this.logger.log(`用户 ${user.username} 密码修改成功`);
  }

  /**
   * 更新最后登录信息
   */
  async updateLastLogin(id: string, ip: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });
  }

  /**
   * 获取用户权限列表（带缓存）
   */
  async getUserPermissions(id: string): Promise<string[]> {
    return this.cacheService.getOrSet(
      `${this.CACHE_PREFIX}:${id}:permissions`,
      async () => {
        const user = await this.userRepository.findOne({
          where: { id },
          relations: ['roles', 'roles.permissions'],
        });
        if (!user || !user.roles) return [];

        const permissions = new Set<string>();
        for (const role of user.roles) {
          if (role.permissions) {
            for (const perm of role.permissions) {
              permissions.add(perm.code);
            }
          }
        }
        return Array.from(permissions);
      },
      this.CACHE_TTL
    );
  }

  /**
   * 简单的密码哈希（生产环境应使用bcrypt）
   */
  private hashPassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  /**
   * 验证密码
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  /**
   * 转换为响应DTO
   */
  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      roleIds: user.roles?.map((r) => r.id),
      remark: user.remark,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
