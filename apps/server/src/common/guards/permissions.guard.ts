import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';

/**
 * 权限守卫 - 基于权限的访问控制
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException('无权访问此资源');
    }

    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('无权访问此资源');
    }

    return true;
  }
}
