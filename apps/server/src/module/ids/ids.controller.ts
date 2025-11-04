import { Controller, Get, Query } from '@nestjs/common';
import { IdService, type IdStrategy } from '../redis/id.service.js';

@Controller('ids')
export class IdsController {
  constructor(private readonly idService: IdService) {}

  @Get('next')
  async getNextId(@Query('strategy') strategy?: IdStrategy, @Query('prefix') prefix?: string) {
    const id = await this.idService.nextId({ strategy, prefix });
    return {
      success: true,
      id,
      strategy: strategy || 'incr',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('batch')
  async getBatchIds(
    @Query('count') count?: string,
    @Query('strategy') strategy?: IdStrategy,
    @Query('prefix') prefix?: string
  ) {
    const numCount = count ? parseInt(count, 10) : 10;
    const ids = await this.idService.batchNextId(numCount, { strategy, prefix });
    return {
      success: true,
      count: ids.length,
      ids,
      strategy: strategy || 'incr',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test-concurrency')
  async testConcurrency(@Query('concurrent') concurrent?: string) {
    const numConcurrent = concurrent ? parseInt(concurrent, 10) : 10;
    const result = await this.idService.testConcurrency(numConcurrent);
    return {
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    };
  }
}
