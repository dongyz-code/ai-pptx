import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configuration.js';
import { AppConfigService } from './config.service.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      cache: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
