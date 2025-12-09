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
 * 登录响应DTO
 */
export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '令牌类型', default: 'Bearer' })
  tokenType: string = 'Bearer';

  @ApiProperty({ description: '过期时间（秒）' })
  expiresIn: number;

  @ApiPropertyOptional({ description: '用户信息' })
  user?: {
    id: string;
    username: string;
    nickname?: string;
    roles: string[];
    permissions: string[];
  };
}

/**
 * 刷新令牌DTO
 */
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  refreshToken: string;
}
