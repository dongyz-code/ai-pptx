import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import { IdService } from './id.service.js';
import { RedisHealthIndicator } from './redis.health.js';

@Global()
@Module({
  providers: [RedisService, IdService, RedisHealthIndicator],
  exports: [RedisService, IdService, RedisHealthIndicator],
})
export class RedisModule {}
