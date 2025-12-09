import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 当前用户装饰器 - 从请求中获取当前登录用户
 */
export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    return null;
  }

  return data ? user[data] : user;
});
