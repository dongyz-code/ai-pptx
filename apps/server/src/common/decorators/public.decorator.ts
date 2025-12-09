import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开接口装饰器 - 跳过认证
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
