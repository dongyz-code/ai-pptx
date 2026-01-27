/**
 * @author yuzhong.dong
 * @description 工作池，用于管理工作线程
 * 1. 主要用来执行密集型CPU任务
 * 2. 支持执行任意导出的函数
 *
 * @example
 * // 创建 worker 池
 * const pool = new WorkerPool({
 *   script: '/path/to/worker-script.ts',
 *   poolSize: 4,
 * });
 *
 * // 执行函数
 * const result = await pool.execFunction('processData', [data], (progress, msg) => {
 *   console.log(`Progress: ${progress}% - ${msg}`);
 * });
 *
 * // 关闭池
 * pool.shutdown();
 */

import { Worker } from 'worker_threads';
import os from 'node:os';
import { extname } from 'node:path';
import { pino } from 'pino';
import { uuidV7 } from '@/utils/ids.js';
import type { WorkerPoolOptions, WorkerTask, WorkResponse, FunctionPayload, WorkerProgressMessage } from './types.js';
import { resolveScriptPathSync } from '@/utils/file.js';

const logger = pino({ name: 'WorkerPool' });

interface WorkerExt extends Worker {
  taskCount: number;
  currentTask?: WorkerTask<FunctionPayload>;
}

const DEFAULT_OPTIONS: WorkerPoolOptions = {
  script: '',
  poolSize: Math.max(1, os.cpus().length - 2),
  retryCount: 3,
  retryInterval: 1000,
  timeout: 60_000,
  maxTaskPerWorker: 30,
};

export class WorkerPool {
  private options: WorkerPoolOptions;
  private workers = new Set<WorkerExt>();
  private idleWorkers: WorkerExt[] = [];
  private taskQueue: WorkerTask<FunctionPayload>[] = [];
  private killed = false;

  constructor(options: Partial<WorkerPoolOptions> & { script: string }) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    for (let i = 0; i < this.options.poolSize; i++) {
      this.createWorker();
    }
  }

  /**
   * 执行导出的函数
   * @param functionName 函数名
   * @param args 函数参数
   * @param onProgress 进度回调
   */
  execFunction<Args extends any[] = any[], Result = any>(
    functionName: string,
    args: Args,
    onProgress?: (progress: number, message?: string) => void
  ): Promise<Result> {
    if (this.killed) throw new Error('Worker pool closed');

    const payload: FunctionPayload = {
      functionName,
      args,
    };

    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        task_id: uuidV7(),
        payload,
        retry: 0,
        resolve,
        reject,
        onProgress,
      });
      this.dispatch();
    });
  }

  /** 调度 */
  private dispatch() {
    while (this.taskQueue.length && this.idleWorkers.length) {
      const worker = this.idleWorkers.shift()!;
      const task = this.taskQueue.shift()!;

      worker.taskCount++;
      worker.currentTask = task;

      const timer = setTimeout(() => {
        this.recycleWorker(worker, new Error('Task timeout'));
      }, this.options.timeout);

      const onMessage = (msg: WorkResponse | WorkerProgressMessage) => {
        // 处理进度消息
        if (msg.type === 'progress') {
          const progressMsg = msg as WorkerProgressMessage;
          task.onProgress?.(progressMsg.progress, progressMsg.message);
          return;
        }

        // 处理结果消息
        if (msg.type !== 'result' || msg.taskId !== task.task_id) return;

        clearTimeout(timer);
        worker.off('message', onMessage);
        worker.currentTask = undefined;

        if (msg.success) {
          task.resolve(msg.result);
        } else {
          this.retry(task, new Error(msg.error?.message));
        }

        this.finish(worker);
      };

      worker.on('message', onMessage);

      worker.postMessage({
        type: 'task',
        taskId: task.task_id,
        payload: task.payload,
      });
    }
  }

  /** 重试 */
  private retry(task: WorkerTask<FunctionPayload>, error: Error) {
    if (task.retry++ < this.options.retryCount) {
      setTimeout(() => {
        this.taskQueue.push(task);
        this.dispatch();
      }, this.options.retryInterval);
    } else {
      task.reject(error);
    }
  }

  /** 完成 */
  private finish(worker: WorkerExt) {
    if (worker.taskCount >= this.options.maxTaskPerWorker) {
      this.recycleWorker(worker);
    } else {
      this.idleWorkers.push(worker);
    }
    this.dispatch();
  }

  /** 创建 worker */
  private createWorker() {
    // 自动识别脚本文件类型
    const script = this.options.script;
    const { type, path: scriptPath } = resolveScriptPathSync(script);

    logger.debug({ type, scriptPath }, 'Creating worker with script');

    // 根据用户脚本的文件类型选择对应的 bootstrap 文件
    const bootstrapPath = type === 'typescript' ? './worker-bootstrap.ts' : './worker-bootstrap.js';

    // 只在 TypeScript 脚本时使用 tsx loader
    const execArgv: string[] = [];
    if (type === 'typescript') {
      execArgv.push('--import', 'tsx');
    }

    const worker = new Worker(bootstrapPath, {
      execArgv,
      workerData: {
        entry: scriptPath,
      },
    }) as WorkerExt;

    worker.taskCount = 0;

    worker.on('exit', () => {
      this.workers.delete(worker);
      this.idleWorkers = this.idleWorkers.filter((w) => w !== worker);

      if (worker.currentTask) {
        this.retry(worker.currentTask, new Error('Worker crashed'));
      }

      if (!this.killed) this.createWorker();
    });

    worker.on('error', (err) => logger.error({ err }, 'Worker error'));

    this.workers.add(worker);
    this.idleWorkers.push(worker);
  }

  /** 回收 */
  private recycleWorker(worker: WorkerExt, err?: Error) {
    this.workers.delete(worker);
    this.idleWorkers = this.idleWorkers.filter((w) => w !== worker);

    if (worker.currentTask && err) {
      this.retry(worker.currentTask, err);
    }

    worker.terminate();
  }

  /**
   * 关闭 worker 池
   */
  shutdown() {
    this.killed = true;
    this.workers.forEach((w) => w.terminate());
    this.taskQueue.forEach((t) => t.reject(new Error('Worker pool closed')));
  }

  /**
   * 获取池状态
   */
  getStatus() {
    return {
      totalWorkers: this.workers.size,
      idleWorkers: this.idleWorkers.length,
      busyWorkers: this.workers.size - this.idleWorkers.length,
      queuedTasks: this.taskQueue.length,
      killed: this.killed,
    };
  }
}
