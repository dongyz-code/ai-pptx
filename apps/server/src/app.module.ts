import { Module } from '@nestjs/common';

import { SystemModule } from './module/system/system.module.js';
import { AppConfigModule } from './common/config/config.module.js';

@Module({
  imports: [AppConfigModule, SystemModule],
})
export class AppModule {}
