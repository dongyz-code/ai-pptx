import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller.js';
import { RoleService } from './role.service.js';
import { RoleEntity } from './entities/role.entity.js';
import { PermissionEntity } from '../permission/entities/permission.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
