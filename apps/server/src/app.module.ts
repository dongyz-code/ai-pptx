import { Module } from '@nestjs/common';

import { SystemModule } from './module/system/system.module.js';
import { AppConfigModule } from './common/config/config.module.js';
import { AppLoggerModule } from './common/logger/index.js';

@Module({
  imports: [AppLoggerModule, AppConfigModule, SystemModule],
})
export class AppModule {}
