import { request } from '@/plugins';
import type { LoginDto, LoginResponseDto, LoginUserInfo } from '@pkg/types';

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login(data: LoginDto): Promise<LoginResponseDto> {
    return request.post<LoginResponseDto>('/auth/login', data);
  },

  /**
   * 用户登出
   */
  logout(): Promise<{ message: string }> {
    return request.post<{ message: string }>('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getProfile(): Promise<LoginUserInfo> {
    return request.get<LoginUserInfo>('/auth/profile');
  },

  /**
   * 刷新令牌
   */
  refreshToken(): Promise<LoginResponseDto> {
    return request.post<LoginResponseDto>('/auth/refresh');
  },
};
