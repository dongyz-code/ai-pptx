import { Controller, Get, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OperationLogService } from './operation-log.service.js';
import { QueryOperationLogDto, DeleteOperationLogsDto } from './dto/operation-log.dto.js';
import { OperationLogEntity } from './entities/operation-log.entity.js';
import { PaginatedResponse } from '../../common/dto/response.dto.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';

@ApiTags('操作日志')
@ApiBearerAuth()
@Controller('operation-logs')
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  @Get()
  @ApiOperation({ summary: '查询操作日志列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('log:list')
  async findAll(@Query() query: QueryOperationLogDto): Promise<PaginatedResponse<OperationLogEntity>> {
    return this.operationLogService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询操作日志' })
  @ApiParam({ name: 'id', description: '日志ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('log:read')
  async findOne(@Param('id') id: string): Promise<OperationLogEntity> {
    return this.operationLogService.findOne(id);
  }

  @Delete()
  @ApiOperation({ summary: '批量删除操作日志' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @Permissions('log:delete')
  async remove(@Body() dto: DeleteOperationLogsDto): Promise<{ deleted: number }> {
    return this.operationLogService.remove(dto);
  }

  @Delete('clear')
  @ApiOperation({ summary: '清空所有操作日志' })
  @ApiResponse({ status: 200, description: '清空成功' })
  @HttpCode(HttpStatus.OK)
  @Permissions('log:clear')
  async clear(): Promise<{ deleted: number }> {
    return this.operationLogService.clear();
  }
}
