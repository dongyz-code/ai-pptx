import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * 登录请求DTO
 */
export class LoginDto {
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
export class LoginUserInfo {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiPropertyOptional({ description: '昵称' })
  nickname?: string;

  @ApiProperty({ description: '角色列表', type: [String] })
  roles: string[];

  @ApiProperty({ description: '权限列表', type: [String] })
  permissions: string[];
}

/**
 * 登录响应DTO
 */
export class LoginResponseDto {
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
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  refreshToken: string;
}
