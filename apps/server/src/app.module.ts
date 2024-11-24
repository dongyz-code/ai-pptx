import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SystemModule } from './module/system/system.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    SystemModule,
  ],
})
export class AppModule {}
