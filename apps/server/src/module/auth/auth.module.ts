import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../system/user/user.module.js';
import { RoleModule } from '../system/role/role.module.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [RedisModule, forwardRef(() => UserModule), forwardRef(() => RoleModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
