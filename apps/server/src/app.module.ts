import { Module } from '@nestjs/common';

import { SystemModule } from './module/system/system.module.js';
import { AppConfigModule } from './common/config/config.module.js';
import { AppLoggerModule } from './common/logger/index.js';
import { RedisModule } from './module/redis/redis.module.js';
import { HealthModule } from './module/health/health.module.js';
import { IdsModule } from './module/ids/ids.module.js';

@Module({
  imports: [AppLoggerModule, AppConfigModule, RedisModule, SystemModule, HealthModule, IdsModule],
})
export class AppModule {}
