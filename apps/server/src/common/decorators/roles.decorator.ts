import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器 - 指定接口所需角色
 * @param roles 角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
