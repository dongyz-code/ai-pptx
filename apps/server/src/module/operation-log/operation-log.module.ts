import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationLogController } from './operation-log.controller.js';
import { OperationLogService } from './operation-log.service.js';
import { OperationLogEntity } from './entities/operation-log.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([OperationLogEntity])],
  controllers: [OperationLogController],
  providers: [OperationLogService],
  exports: [OperationLogService],
})
export class OperationLogModule {}
