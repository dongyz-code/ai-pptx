import { Injectable, ConflictException, NotFoundException, OnModuleInit, Inject } from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RoleEntity, RoleStatus } from './entities/role.entity.js';
import { PermissionEntity } from '../permission/entities/permission.entity.js';
import { CreateRoleDto, UpdateRoleDto, QueryRoleDto, RoleResponseDto, AssignPermissionsDto } from './dto/role.dto.js';
import { PaginatedResponse } from '@/common/dto/response.dto.js';
import { CacheService } from '@/common/cache/cache.service.js';
import { IdService } from '@/common/id/id.service.js';

/**
 * 角色服务 - 角色管理业务逻辑
 */
@Injectable()
export class RoleService implements OnModuleInit {
  private readonly CACHE_KEY_ALL = 'roles:all';
  private readonly CACHE_TTL = 600; // 10分钟

  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private readonly cacheService: CacheService,
    private readonly idService: IdService
  ) {
    this.logger.setContext(RoleService.name);
  }

  async onModuleInit() {
    await this.initDefaultRoles();
  }

  private async initDefaultRoles() {
    const adminExists = await this.roleRepository.findOne({ where: { code: 'admin' } });
    if (!adminExists) {
      await this.roleRepository.save({
        id: 'role-admin',
        name: '系统管理员',
        code: 'admin',
        description: '拥有系统所有权限',
        status: RoleStatus.ACTIVE,
        sort: 1,
      });

      await this.roleRepository.save({
        id: 'role-user',
        name: '普通用户',
        code: 'user',
        description: '普通用户角色',
        status: RoleStatus.ACTIVE,
        sort: 10,
      });

      this.logger.info('默认角色已初始化');
    }
  }

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findOne({
      where: { code: createRoleDto.code },
    });
    if (existingRole) {
      throw new ConflictException('角色编码已存在');
    }

    const id = await this.idService.nextId({ prefix: 'role-' });

    // 获取权限
    let permissions: PermissionEntity[] = [];
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      permissions = await this.permissionRepository.findByIds(createRoleDto.permissionIds);
    }

    const role = this.roleRepository.create({
      id,
      ...createRoleDto,
      status: createRoleDto.status || RoleStatus.ACTIVE,
      permissions,
    });

    await this.roleRepository.save(role);
    await this.invalidateCache();

    this.logger.info(`角色 ${role.name} 创建成功`);
    return this.toResponseDto(role);
  }

  /**
   * 查询角色列表（分页）
   */
  async findAll(query: QueryRoleDto) {
    const { page = 1, pageSize = 10, name, code, status } = query;

    const where: any = {};
    if (name) where.name = Like(`%${name}%`);
    if (code) where.code = code;
    if (status) where.status = status;

    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      relations: ['permissions'],
      order: { sort: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const list = roles.map((r) => this.toResponseDto(r));
    return new PaginatedResponse(list, total, page, pageSize);
  }

  /**
   * 获取所有角色（带缓存，用于下拉选择）
   */
  async findAllSimple(): Promise<RoleResponseDto[]> {
    return this.cacheService.getOrSet(
      this.CACHE_KEY_ALL,
      async () => {
        const roles = await this.roleRepository.find({
          where: { status: RoleStatus.ACTIVE },
          order: { sort: 'ASC' },
        });
        return roles.map((r) => this.toResponseDto(r));
      },
      this.CACHE_TTL
    );
  }

  /**
   * 根据ID查询角色
   */
  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return this.toResponseDto(role);
  }

  /**
   * 根据角色ID列表获取权限
   */
  async getPermissionsByRoleIds(roleIds: string[]): Promise<string[]> {
    if (!roleIds || roleIds.length === 0) return [];

    const roles = await this.roleRepository.find({
      where: roleIds.map((id) => ({ id })),
      relations: ['permissions'],
    });

    const permissions = new Set<string>();
    for (const role of roles) {
      if (role.code === 'admin') {
        permissions.add('*'); // 管理员拥有所有权限
      }
      if (role.permissions) {
        role.permissions.forEach((p) => permissions.add(p.code));
      }
    }
    return Array.from(permissions);
  }

  /**
   * 更新角色
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = await this.roleRepository.findOne({
        where: { code: updateRoleDto.code },
      });
      if (existingRole) {
        throw new ConflictException('角色编码已存在');
      }
    }

    if (updateRoleDto.permissionIds) {
      role.permissions = await this.permissionRepository.findByIds(updateRoleDto.permissionIds);
    }

    Object.assign(role, {
      name: updateRoleDto.name ?? role.name,
      code: updateRoleDto.code ?? role.code,
      description: updateRoleDto.description ?? role.description,
      status: updateRoleDto.status ?? role.status,
      sort: updateRoleDto.sort ?? role.sort,
    });

    await this.roleRepository.save(role);
    await this.invalidateCache();

    this.logger.info(`角色 ${role.name} 更新成功`);
    return this.toResponseDto(role);
  }

  /**
   * 删除角色
   */
  async remove(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    await this.roleRepository.remove(role);
    await this.invalidateCache();

    this.logger.info(`角色 ${role.name} 删除成功`);
  }

  /**
   * 分配权限
   */
  async assignPermissions(id: string, dto: AssignPermissionsDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    role.permissions = await this.permissionRepository.findByIds(dto.permissionIds);
    await this.roleRepository.save(role);
    await this.invalidateCache();

    this.logger.info(`角色 ${role.name} 权限分配成功`);
    return this.toResponseDto(role);
  }

  private async invalidateCache(): Promise<void> {
    await this.cacheService.del(this.CACHE_KEY_ALL);
    // 清除用户权限缓存
    await this.cacheService.delByPattern('user:*:permissions');
  }

  private toResponseDto(role: RoleEntity): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      status: role.status,
      permissionIds: role.permissions?.map((p) => p.id),
      sort: role.sort,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
