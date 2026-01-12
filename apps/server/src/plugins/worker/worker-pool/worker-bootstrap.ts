/**
 * @author yuzhong.dong
 * @description Worker 线程启动文件
 * 负责加载用户脚本并执行导出的函数
 *
 * 使用方式：
 * 1. 用户脚本需要导出具名函数
 * 2. 通过 WorkerPool.execFunction(functionName, args) 调用
 *
 * @example
 * // worker-script.ts
 * export async function processData(data: any) {
 *   // 处理数据
 *   return result;
 * }
 *
 * export function calculateSum(a: number, b: number) {
 *   return a + b;
 * }
 *
 * // 在 worker 中发送进度
 * import { sendProgress } from '@/plugins/worker';
 * export async function longTask(data: any) {
 *   sendProgress(0, 'Starting...');
 *   // ... 处理
 *   sendProgress(50, 'Half done...');
 *   // ... 处理
 *   sendProgress(100, 'Completed');
 *   return result;
 * }
 */

import { parentPort, workerData } from 'worker_threads';
import { pathToFileURL } from 'node:url';
import { test } from './test.js';
import type { WorkResponse, FunctionPayload } from './types.js';

if (!parentPort) {
  throw new Error('This file must be run as a Worker');
}

interface TaskMessage {
  type: 'task';
  taskId: string;
  payload: FunctionPayload;
}

let workerModule: any = null;

// 加载用户脚本
(async () => {
  test();
  try {
    const scriptPath = workerData.entry;
    if (!scriptPath) {
      throw new Error('Worker script path is required');
    }

    // 动态导入用户脚本
    const scriptUrl = pathToFileURL(scriptPath).href;
    workerModule = await import(scriptUrl);

    // 通知主线程 worker 已准备就绪
    parentPort!.postMessage({ type: 'ready' });
  } catch (error) {
    console.error('Failed to load worker script:', error);
    process.exit(1);
  }
})();

// 监听任务消息
parentPort.on('message', async (message: TaskMessage) => {
  if (message.type !== 'task') return;

  const { taskId, payload } = message;
  const response: WorkResponse = {
    taskId,
    success: false,
  };

  try {
    if (!workerModule) {
      throw new Error('Worker module not loaded');
    }

    const { functionName, args } = payload;

    // 检查函数是否存在
    if (typeof workerModule[functionName] !== 'function') {
      throw new Error(`Function "${functionName}" not found in worker module`);
    }

    // 执行函数
    const result = await workerModule[functionName](...args);

    response.success = true;
    response.result = result;
  } catch (error: any) {
    response.success = false;
    response.error = {
      message: error.message || 'Unknown error',
      stack: error.stack,
    };
  }

  parentPort!.postMessage({
    type: 'result',
    ...response,
  });
});
