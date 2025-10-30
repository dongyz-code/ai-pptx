import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { SystemModule } from './module/system/system.module.js';
import { AppConfigModule } from './common/config/config.module.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: false,
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    AppConfigModule,
    SystemModule,
  ],
})
export class AppModule {}
