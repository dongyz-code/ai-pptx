import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  PermissionEntity,
  PermissionType,
  PermissionStatus,
} from './entities/permission.entity.js';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  QueryPermissionDto,
  PermissionResponseDto,
  PermissionTreeResponseDto,
} from './dto/permission.dto.js';
import { PaginatedResponse } from '@/common/dto/response.dto.js';
import { CacheService } from '@/common/cache/cache.service.js';
import { IdService } from '@/common/id/id.service.js';

/**
 * 权限服务 - 权限管理业务逻辑
 */
@Injectable()
export class PermissionService implements OnModuleInit {
  private readonly CACHE_KEY_TREE = 'permissions:tree';
  private readonly CACHE_TTL = 600; // 10分钟

  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private readonly cacheService: CacheService,
    private readonly idService: IdService
  ) {
    this.logger.setContext(PermissionService.name);
  }

  async onModuleInit() {
    await this.initDefaultPermissions();
  }

  private async initDefaultPermissions() {
    const exists = await this.permissionRepository.findOne({ where: { code: 'user' } });
    if (exists) return;

    const defaultPermissions: Partial<PermissionEntity>[] = [
      {
        id: 'perm-user',
        name: '用户管理',
        code: 'user',
        type: PermissionType.MENU,
        sort: 1,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-user-list',
        name: '用户列表',
        code: 'user:list',
        type: PermissionType.BUTTON,
        parentId: 'perm-user',
        sort: 1,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-user-create',
        name: '创建用户',
        code: 'user:create',
        type: PermissionType.BUTTON,
        parentId: 'perm-user',
        sort: 2,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-user-read',
        name: '查看用户',
        code: 'user:read',
        type: PermissionType.BUTTON,
        parentId: 'perm-user',
        sort: 3,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-user-update',
        name: '更新用户',
        code: 'user:update',
        type: PermissionType.BUTTON,
        parentId: 'perm-user',
        sort: 4,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-user-delete',
        name: '删除用户',
        code: 'user:delete',
        type: PermissionType.BUTTON,
        parentId: 'perm-user',
        sort: 5,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-role',
        name: '角色管理',
        code: 'role',
        type: PermissionType.MENU,
        sort: 2,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-role-list',
        name: '角色列表',
        code: 'role:list',
        type: PermissionType.BUTTON,
        parentId: 'perm-role',
        sort: 1,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-role-create',
        name: '创建角色',
        code: 'role:create',
        type: PermissionType.BUTTON,
        parentId: 'perm-role',
        sort: 2,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-role-update',
        name: '更新角色',
        code: 'role:update',
        type: PermissionType.BUTTON,
        parentId: 'perm-role',
        sort: 3,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-role-delete',
        name: '删除角色',
        code: 'role:delete',
        type: PermissionType.BUTTON,
        parentId: 'perm-role',
        sort: 4,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-permission',
        name: '权限管理',
        code: 'permission',
        type: PermissionType.MENU,
        sort: 3,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-permission-list',
        name: '权限列表',
        code: 'permission:list',
        type: PermissionType.BUTTON,
        parentId: 'perm-permission',
        sort: 1,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-log',
        name: '日志管理',
        code: 'log',
        type: PermissionType.MENU,
        sort: 4,
        status: PermissionStatus.ACTIVE,
      },
      {
        id: 'perm-log-list',
        name: '日志列表',
        code: 'log:list',
        type: PermissionType.BUTTON,
        parentId: 'perm-log',
        sort: 1,
        status: PermissionStatus.ACTIVE,
      },
    ];

    await this.permissionRepository.save(defaultPermissions);
    this.logger.info('默认权限已初始化');
  }

  /**
   * 创建权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });
    if (existingPermission) {
      throw new ConflictException('权限编码已存在');
    }

    const id = await this.idService.nextId({ prefix: 'perm-' });

    const permission = this.permissionRepository.create({
      id,
      ...createPermissionDto,
      status: createPermissionDto.status || PermissionStatus.ACTIVE,
    });

    const saved = await this.permissionRepository.save(permission);
    await this.invalidateCache();

    this.logger.info(`权限 ${permission.name} 创建成功`);
    return { ...saved };
  }

  /**
   * 查询权限列表（分页）
   */
  async findAll(query: QueryPermissionDto) {
    const { page = 1, pageSize = 10, name, code, type, status } = query;

    const where: any = {};
    if (name) where.name = Like(`%${name}%`);
    if (code) where.code = Like(`%${code}%`);
    if (type) where.type = type;
    if (status) where.status = status;

    const [permissions, total] = await this.permissionRepository.findAndCount({
      where,
      order: { sort: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return new PaginatedResponse(permissions as PermissionResponseDto[], total, page, pageSize);
  }

  /**
   * 获取权限树（带缓存）
   */
  async getTree(): Promise<PermissionTreeResponseDto[]> {
    return this.cacheService.getOrSet(
      this.CACHE_KEY_TREE,
      async () => {
        const permissions = await this.permissionRepository.find({
          where: { status: PermissionStatus.ACTIVE },
          order: { sort: 'ASC' },
        });
        return this.buildTree(permissions);
      },
      this.CACHE_TTL
    );
  }

  private buildTree(
    permissions: PermissionEntity[],
    parentId?: string
  ): PermissionTreeResponseDto[] {
    return permissions
      .filter((p) => p.parentId === parentId)
      .map((p) => ({
        ...p,
        children: this.buildTree(permissions, p.id),
      }));
  }

  /**
   * 根据ID查询权限
   */
  async findOne(id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }
    return { ...permission };
  }

  /**
   * 根据编码列表获取权限
   */
  async findByCodes(codes: string[]): Promise<PermissionEntity[]> {
    if (!codes || codes.length === 0) return [];
    return this.permissionRepository
      .createQueryBuilder('p')
      .where('p.code IN (:...codes)', { codes })
      .getMany();
  }

  /**
   * 更新权限
   */
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    if (updatePermissionDto.code && updatePermissionDto.code !== permission.code) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });
      if (existingPermission) {
        throw new ConflictException('权限编码已存在');
      }
    }

    Object.assign(permission, updatePermissionDto);
    const saved = await this.permissionRepository.save(permission);
    await this.invalidateCache();

    this.logger.info(`权限 ${permission.name} 更新成功`);
    return { ...saved };
  }

  /**
   * 删除权限
   */
  async remove(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    const hasChildren = await this.permissionRepository.findOne({ where: { parentId: id } });
    if (hasChildren) {
      throw new ConflictException('存在子权限，无法删除');
    }

    await this.permissionRepository.remove(permission);
    await this.invalidateCache();

    this.logger.info(`权限 ${permission.name} 删除成功`);
  }

  private async invalidateCache(): Promise<void> {
    await this.cacheService.del(this.CACHE_KEY_TREE);
    await this.cacheService.del('roles:all');
    await this.cacheService.delByPattern('user:*:permissions');
  }
}
