import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserEntity } from './entities/user.entity.js';
import { RoleEntity } from '../role/entities/role.entity.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
