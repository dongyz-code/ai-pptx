import { Module } from '@nestjs/common';
import { SystemController } from './system.controller.js';
import { SystemService } from './system.service.js';

@Module({
  imports: [],
  providers: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
