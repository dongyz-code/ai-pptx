import { Controller, Post, Get, Body, Headers, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, LoginResponseDto, LoginUserInfo } from './dto/auth.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ApiResponseWrapper, ApiErrorResponse } from '../../common/decorators/api-response-wrapper.decorator.js';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiResponseWrapper(LoginResponseDto, { description: '登录成功' })
  @ApiErrorResponse(401, '用户名或密码错误')
  async login(@Body() loginDto: LoginDto, @Req() request: any): Promise<LoginResponseDto> {
    const ip = request.ip || request.headers['x-forwarded-for'] || '';
    return this.authService.login(loginDto, ip);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  @ApiResponseWrapper(null, { description: '登出成功' })
  async logout(@Headers('authorization') authHeader: string): Promise<{ message: string }> {
    const token = authHeader?.replace('Bearer ', '');
    await this.authService.logout(token);
    return { message: '登出成功' };
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponseWrapper(LoginUserInfo, { description: '获取成功' })
  async getProfile(@CurrentUser('id') userId: string): Promise<any> {
    return this.authService.getProfile(userId);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '刷新令牌' })
  @ApiResponseWrapper(LoginResponseDto, { description: '刷新成功' })
  async refreshToken(@Headers('authorization') authHeader: string): Promise<LoginResponseDto> {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.refreshToken(token);
  }
}
