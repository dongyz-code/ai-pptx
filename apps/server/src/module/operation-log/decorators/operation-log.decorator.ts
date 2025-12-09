import { SetMetadata } from '@nestjs/common';

export const OPERATION_LOG_KEY = 'operationLog';

export interface OperationLogMetadata {
  module: string;
  action: string;
}

/**
 * 操作日志装饰器
 * @param module 模块名称
 * @param action 操作名称
 */
export const OperationLog = (module: string, action: string) =>
  SetMetadata(OPERATION_LOG_KEY, { module, action } as OperationLogMetadata);
