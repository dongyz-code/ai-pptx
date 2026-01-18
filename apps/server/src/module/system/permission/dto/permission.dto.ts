import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum, IsNumber } from 'class-validator';
import { PermissionType, PermissionStatus } from '../entities/permission.entity.js';
import { PaginationDto } from '@/common/dto/response.dto.js';

/**
 * 创建权限DTO
 */
export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '权限编码（唯一标识）', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiProperty({ description: '权限类型', enum: PermissionType })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiPropertyOptional({ description: '父级权限ID' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: '路由路径' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  path?: string;

  @ApiPropertyOptional({ description: '图标' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ description: '排序号' })
  @IsNumber()
  @IsOptional()
  sort?: number;

  @ApiPropertyOptional({ description: '权限状态', enum: PermissionStatus })
  @IsEnum(PermissionStatus)
  @IsOptional()
  status?: PermissionStatus;

  @ApiPropertyOptional({ description: '描述', maxLength: 200 })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}

/**
 * 更新权限DTO
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

/**
 * 查询权限DTO
 */
export class QueryPermissionDto extends PaginationDto {
  @ApiPropertyOptional({ description: '权限名称（模糊搜索）' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '权限编码（模糊搜索）' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: '权限类型', enum: PermissionType })
  @IsEnum(PermissionType)
  @IsOptional()
  type?: PermissionType;

  @ApiPropertyOptional({ description: '状态', enum: PermissionStatus })
  @IsEnum(PermissionStatus)
  @IsOptional()
  status?: PermissionStatus;
}

/**
 * 权限响应DTO
 */
export class PermissionResponseDto {
  @ApiProperty({ description: '权限ID' })
  id: string;

  @ApiProperty({ description: '权限名称' })
  name: string;

  @ApiProperty({ description: '权限编码' })
  code: string;

  @ApiProperty({ description: '权限类型', enum: PermissionType })
  type: PermissionType;

  @ApiPropertyOptional({ description: '父级权限ID' })
  parentId?: string;

  @ApiPropertyOptional({ description: '路由路径' })
  path?: string;

  @ApiPropertyOptional({ description: '图标' })
  icon?: string;

  @ApiPropertyOptional({ description: '排序号' })
  sort?: number;

  @ApiProperty({ description: '权限状态', enum: PermissionStatus })
  status: PermissionStatus;

  @ApiPropertyOptional({ description: '描述' })
  description?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}

/**
 * 权限树响应DTO
 */
export class PermissionTreeResponseDto {
  @ApiProperty({ description: '权限ID', type: String })
  id: string;

  @ApiProperty({ description: '权限名称', type: String })
  name: string;

  @ApiProperty({ description: '权限编码', type: String })
  code: string;

  @ApiProperty({ description: '权限类型', enum: PermissionType })
  type: PermissionType;

  @ApiPropertyOptional({ description: '父级权限ID', type: String })
  parentId?: string;

  @ApiPropertyOptional({ description: '路由路径', type: String })
  path?: string;

  @ApiPropertyOptional({ description: '图标', type: String })
  icon?: string;

  @ApiPropertyOptional({ description: '排序号', type: Number })
  sort?: number;

  @ApiProperty({ description: '权限状态', enum: PermissionStatus })
  status: PermissionStatus;

  @ApiPropertyOptional({ description: '描述', type: String })
  description?: string;

  @ApiProperty({ description: '创建时间', type: Date })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '子权限列表' })
  children?: any[];
}
