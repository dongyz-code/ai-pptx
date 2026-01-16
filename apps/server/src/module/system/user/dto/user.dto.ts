import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsEnum, IsArray } from 'class-validator';
import { UserStatus } from '../entities/user.entity.js';
import { PaginationDto } from '@/common/dto/response.dto.js';

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @ApiProperty({ description: '用户名', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: '密码', minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: '用户状态', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  remark?: string;
}

/**
 * 更新用户DTO（所有字段可选，排除用户名）
 */
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['username'] as const)) {}

/**
 * 查询用户DTO
 */
export class QueryUserDto extends PaginationDto {
  @ApiPropertyOptional({ description: '用户名（模糊搜索）' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '昵称（模糊搜索）' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '状态', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

/**
 * 用户响应DTO（排除密码）
 */
export class UserResponseDto {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiPropertyOptional({ description: '昵称' })
  nickname?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号' })
  phone?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  avatar?: string;

  @ApiProperty({ description: '用户状态', enum: UserStatus })
  status: UserStatus;

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  roleIds?: string[];

  @ApiPropertyOptional({ description: '备注' })
  remark?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '最后登录时间' })
  lastLoginAt?: Date;
}

/**
 * 修改密码DTO
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '旧密码' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: '新密码', minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}
