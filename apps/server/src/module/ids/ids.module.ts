import { Module } from '@nestjs/common';
import { IdsController } from './ids.controller.js';

@Module({
  controllers: [IdsController],
})
export class IdsModule {}
