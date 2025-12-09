import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/response.dto.js';

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
  @ApiPropertyOptional({ description: '日志ID列表（不传则根据时间范围删除）', type: [String] })
  @IsString({ each: true })
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional({ description: '删除该时间之前的日志' })
  @IsDateString()
  @IsOptional()
  beforeTime?: string;
}
