import { UserStatus } from '../auth';

/**
 * 分页请求参数
 */
export interface PageDto {
  page?: number;
  pageSize?: number;
}

/**
 * 分页响应数据
 */
export interface PageResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 角色实体
 */
export interface RoleEntity {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 权限实体
 */
export interface PermissionEntity {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户列表项
 */
export interface UserListItem {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  status: UserStatus;
  roles: RoleEntity[];
  createdAt: Date;
  lastLoginAt?: Date;
}

/**
 * 创建/更新用户
 */
export interface CreateUserDto {
  username: string;
  password?: string;
  nickname?: string;
  email?: string;
  status?: UserStatus;
  roleIds?: string[];
}

/**
 * 创建/更新角色
 */
export interface CreateRoleDto {
  name: string;
  code: string;
  description?: string;
  permissionIds?: string[];
}

/**
 * 创建/更新权限
 */
export interface CreatePermissionDto {
  name: string;
  code: string;
  description?: string;
}
