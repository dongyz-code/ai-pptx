import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module.js';
import { RoleModule } from './role/role.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [PermissionModule, RoleModule, UserModule],
  providers: [],
  controllers: [],
})
export class SystemModule {}
