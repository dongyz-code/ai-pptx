import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/response.dto.js';

/**
 * 响应转换拦截器 - 统一包装所有响应
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果已经是 ApiResponse 格式，直接返回
        if (data instanceof ApiResponse) {
          return data;
        }
        // 否则包装成标准格式
        return ApiResponse.success(data);
      })
    );
  }
}
