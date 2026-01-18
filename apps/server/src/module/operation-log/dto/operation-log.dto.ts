import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { PaginationDto } from '@/common/dto/response.dto.js';

/**
 * 查询操作日志DTO
 */
export class QueryOperationLogDto extends PaginationDto {
  @ApiPropertyOptional({ description: '用户名（模糊搜索）' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '模块名称' })
  @IsString()
  @IsOptional()
  module?: string;

  @ApiPropertyOptional({ description: '操作名称' })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiPropertyOptional({ description: '请求URL（模糊搜索）' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ description: '状态码' })
  @IsNumber()
  @IsOptional()
  statusCode?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

/**
 * 批量删除操作日志DTO
 */
export class DeleteOperationLogsDto {
  @ApiPropertyOptional({ description: '日志ID列表（不传则根据时间范围删除）', type: String, isArray: true })
  @IsString({ each: true })
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional({ description: '删除该时间之前的日志' })
  @IsDateString()
  @IsOptional()
  beforeTime?: string;
}

/**
 * 操作日志响应DTO
 */
export class OperationLogResponseDto {
  @ApiProperty({ description: '日志ID', type: () => String })
  id: string;

  @ApiPropertyOptional({ description: '用户ID', type: () => String })
  userId?: string;

  @ApiPropertyOptional({ description: '用户名', type: () => String })
  username?: string;

  @ApiProperty({ description: '模块名称', type: () => String })
  module: string;

  @ApiProperty({ description: '操作名称', type: () => String })
  action: string;

  @ApiProperty({ description: 'HTTP方法', type: () => String })
  method: string;

  @ApiProperty({ description: '请求URL', type: () => String })
  url: string;

  @ApiPropertyOptional({ description: '请求IP', type: () => String })
  ip?: string;

  @ApiPropertyOptional({ description: '请求参数', type: () => Object })
  params?: Record<string, any>;

  @ApiPropertyOptional({ description: '请求体', type: () => Object })
  body?: Record<string, any>;

  @ApiPropertyOptional({ description: '响应结果', type: () => Object })
  result?: Record<string, any>;

  @ApiPropertyOptional({ description: '错误信息', type: () => String })
  error?: string;

  @ApiProperty({ description: '状态码', type: () => Number })
  statusCode: number;

  @ApiProperty({ description: '耗时（毫秒）', type: () => Number })
  duration: number;

  @ApiPropertyOptional({ description: 'User-Agent', type: () => String })
  userAgent?: string;

  @ApiProperty({ description: '创建时间', type: () => Date })
  createdAt: Date;
}
