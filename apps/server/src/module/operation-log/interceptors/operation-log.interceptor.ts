import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { OPERATION_LOG_KEY, OperationLogMetadata } from '../decorators/operation-log.decorator.js';
import { OperationLogService } from '../operation-log.service.js';
import { OperationLogEntity } from '../entities/operation-log.entity.js';

/**
 * 操作日志拦截器 - 记录带有 @OperationLog 装饰器的操作
 */
@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OperationLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly operationLogService: OperationLogService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const operationLogMeta = this.reflector.get<OperationLogMetadata>(OPERATION_LOG_KEY, context.getHandler());

    // 如果没有装饰器，直接跳过
    if (!operationLogMeta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    const logEntry: Partial<OperationLogEntity> = {
      module: operationLogMeta.module,
      action: operationLogMeta.action,
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers['x-forwarded-for'] || '',
      params: request.params,
      body: this.sanitizeBody(request.body),
      userAgent: request.headers['user-agent'],
      userId: request.user?.id,
      username: request.user?.username,
    };

    return next.handle().pipe(
      tap((result) => {
        const duration = Date.now() - startTime;
        this.operationLogService
          .create({
            ...logEntry,
            result: this.truncateResult(result),
            statusCode: 200,
            duration,
          } as any)
          .catch((err) => {
            this.logger.error(`Failed to save operation log: ${err.message}`);
          });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.operationLogService
          .create({
            ...logEntry,
            error: error.message,
            statusCode: error.status || 500,
            duration,
          } as any)
          .catch((err) => {
            this.logger.error(`Failed to save operation log: ${err.message}`);
          });
        throw error;
      })
    );
  }

  /**
   * 清理请求体中的敏感信息
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    // 隐藏密码
    if (sanitized.password) {
      sanitized.password = '******';
    }
    if (sanitized.oldPassword) {
      sanitized.oldPassword = '******';
    }
    if (sanitized.newPassword) {
      sanitized.newPassword = '******';
    }
    return sanitized;
  }

  /**
   * 截断过长的响应结果
   */
  private truncateResult(result: any): any {
    if (!result) return result;
    const str = JSON.stringify(result);
    if (str.length > 1000) {
      return { _truncated: true, message: 'Response too large to log' };
    }
    return result;
  }
}
