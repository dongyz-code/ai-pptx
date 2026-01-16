import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './configuration.js';
import { AppConfigService } from './config.service.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, ConfigModule],
})
export class AppConfigModule {}
