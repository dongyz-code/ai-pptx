/**
 * Worker 辅助函数
 * 可以在 worker 脚本中使用的工具函数
 */

import { parentPort } from 'worker_threads';

/**
 * 在 worker 中发送进度消息到主线程
 */
export function sendProgress(progress: number, message?: string) {
  if (!parentPort) {
    throw new Error('sendProgress: 必须在 worker 线程中执行');
  }

  parentPort.postMessage({
    type: 'progress',
    progress,
    message,
  });
}
