import { Global, Module } from '@nestjs/common';
import { IdService } from './id.service.js';

@Global()
@Module({
  providers: [IdService],
  exports: [IdService],
})
export class IdModule {}
