import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Common modules
import { AppConfigModule } from './common/config/config.module.js';
import { AppLoggerModule } from './common/logger/index.js';
import { DatabaseModule } from './common/database/database.module.js';
import { CacheModule } from './common/cache/cache.module.js';

// Common providers
import { AuthGuard } from './common/guards/auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

// Business modules
import { RedisModule } from './module/redis/redis.module.js';
import { HealthModule } from './module/health/health.module.js';
import { IdsModule } from './module/ids/ids.module.js';
import { AuthModule } from './module/auth/auth.module.js';
import { OperationLogModule } from './module/operation-log/operation-log.module.js';
import { SystemModule } from './module/system/system.module.js';

@Module({
  imports: [
    // Infrastructure modules
    AppLoggerModule,
    AppConfigModule,
    DatabaseModule, // TypeORM PostgreSQL
    CacheModule, // Redis Cache
    RedisModule,

    // Core business modules
    AuthModule,
    OperationLogModule,

    // System modules
    HealthModule,
    IdsModule,
    SystemModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global response transform interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global auth guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global permissions guard
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
