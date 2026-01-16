import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller.js';
import { PermissionService } from './permission.service.js';
import { PermissionEntity } from './entities/permission.entity.js';
import { RedisModule } from '@/module/redis/redis.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity]), RedisModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
