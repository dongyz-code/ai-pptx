import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service.js';
import { RedisModule } from '../../module/redis/redis.module.js';

@Global()
@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
