import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum, IsArray, IsNumber } from 'class-validator';
import { RoleStatus } from '../entities/role.entity.js';
import { PaginationDto } from '@/common/dto/response.dto.js';

/**
 * 创建角色DTO
 */
export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '角色编码（唯一标识）', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: '角色描述', maxLength: 200 })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '角色状态', enum: RoleStatus })
  @IsEnum(RoleStatus)
  @IsOptional()
  status?: RoleStatus;

  @ApiPropertyOptional({ description: '权限ID列表', type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[];

  @ApiPropertyOptional({ description: '排序号' })
  @IsNumber()
  @IsOptional()
  sort?: number;
}

/**
 * 更新角色DTO
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

/**
 * 查询角色DTO
 */
export class QueryRoleDto extends PaginationDto {
  @ApiPropertyOptional({ description: '角色名称（模糊搜索）' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '角色编码（精确匹配）' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: '状态', enum: RoleStatus })
  @IsEnum(RoleStatus)
  @IsOptional()
  status?: RoleStatus;
}

/**
 * 角色响应DTO
 */
export class RoleResponseDto {
  @ApiProperty({ description: '角色ID', type: () => String })
  id: string;

  @ApiProperty({ description: '角色名称', type: () => String })
  name: string;

  @ApiProperty({ description: '角色编码', type: () => String })
  code: string;

  @ApiPropertyOptional({ description: '角色描述', type: () => String })
  description?: string;

  @ApiProperty({ description: '角色状态', enum: RoleStatus })
  status: RoleStatus;

  @ApiPropertyOptional({ description: '权限ID列表', type: () => String, isArray: true })
  permissionIds?: string[];

  @ApiPropertyOptional({ description: '排序号', type: () => Number })
  sort?: number;

  @ApiProperty({ description: '创建时间', type: () => Date })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', type: () => Date })
  updatedAt: Date;
}

/**
 * 分配权限DTO
 */
export class AssignPermissionsDto {
  @ApiProperty({ description: '权限ID列表', type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
