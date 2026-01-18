import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import type { LoginDto as ILoginDto, LoginUserInfo as ILoginUserInfo, LoginResponseDto as ILoginResponseDto, RefreshTokenDto as IRefreshTokenDto } from '@pkg/types';

/**
 * 登录请求DTO
 */
export class LoginDto implements ILoginDto {
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
}

/**
 * 登录用户信息
 */
export class LoginUserInfo implements ILoginUserInfo {
  @ApiProperty({ description: '用户ID', type: () => String })
  id: string;

  @ApiProperty({ description: '用户名', type: () => String })
  username: string;

  @ApiPropertyOptional({ description: '昵称', type: () => String })
  nickname?: string;

  @ApiProperty({ description: '角色列表', type: () => String, isArray: true })
  roles: string[];

  @ApiProperty({ description: '权限列表', type: () => String, isArray: true })
  permissions: string[];
}

/**
 * 登录响应DTO
 */
export class LoginResponseDto implements ILoginResponseDto {
  @ApiProperty({ description: '访问令牌', type: String })
  accessToken: string;

  @ApiProperty({ description: '令牌类型', default: 'Bearer', type: String })
  tokenType: string = 'Bearer';

  @ApiProperty({ description: '过期时间（秒）', type: Number })
  expiresIn: number;

  @ApiPropertyOptional({ description: '用户信息', type: () => LoginUserInfo })
  user?: LoginUserInfo;
}

/**
 * 刷新令牌DTO
 */
export class RefreshTokenDto implements IRefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  refreshToken: string;
}
