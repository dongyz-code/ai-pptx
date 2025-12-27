import { Worker } from 'worker_threads';
import os from 'node:os';
import { uuidV7 } from '@/utils/ids.js';
import type { WorkerPoolOptions, WorkerTask, WorkResponse } from './types.js';

interface WorkerExt extends Worker {
  /** 已处理任务数量 */
  taskCount: number;
}

const DEFAULT_OPTIONS: WorkerPoolOptions = {
  script: '',
  poolSize: os.cpus().length - 2,
  retryCount: 3,
  retryInterval: 1000,
  timeout: 24 * 60 * 60 * 1000,
  maxMemory: 2 * 1024 * 1024 * 1024,
  maxTaskPerWorker: 30,
};

export class WorkerPool<T> {
  private options: WorkerPoolOptions;

  /** 当前存活的Worker */
  private workers = new Set<WorkerExt>();

  /** 空闲 Worker */
  private idleWorkers: WorkerExt[] = [];

  /** 任务队列 */
  private taskQueue: WorkerTask<T>[] = [];

  /** 是否关闭 */
  private killed = false;

  constructor(options: WorkerPoolOptions) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);

    const { poolSize } = this.options;

    for (let i = 0; i < poolSize; i++) {
      this.createWorker();
    }
  }

  /**
   * 执行任务
   */
  exec(payload: T) {
    if (this.killed) {
      throw new Error('Worker pool closed');
    }

    return new Promise((resolve, reject) => {
      const task: WorkerTask<T> = {
        task_id: uuidV7(),
        payload,
        retry: 0,
        resolve: resolve,
        reject: reject,
      };
      this.taskQueue.push(task);

      // 尝试立即调度
      this.dispatchTask();
    });
  }

  /**
   * dispatch 从任务中取出任务并分配给 worker
   */
  private dispatchTask() {
    if (!this.taskQueue.length || !this.idleWorkers.length) {
      return;
    }

    const task = this.taskQueue.shift()!;
    const worker = this.idleWorkers.shift()!;

    worker.taskCount++;

    // 监听 worker 返回
    worker.once('message', (msg: WorkResponse) => {
      if (msg.success) {
        task.resolve(msg.result);
      } else {
        this.retry(task, new Error(msg.error?.message));
      }

      this.finish(worker);
    });

    // 发送任务给 worker
    worker.postMessage({
      taskId: task.task_id,
      payload: task.payload,
    });
  }

  /**
   * 重试
   */
  private retry(task: WorkerTask<T>, error: Error) {
    if (task.retry < this.options.retryCount) {
      task.retry++;
      const delay = Math.min(this.options.retryInterval, 30_000);

      setTimeout(() => {
        this.taskQueue.push(task);
        this.dispatchTask();
      }, delay);
    } else {
      task.reject(error);
    }
  }

  /**
   * 完成任务
   */
  private finish(worker: WorkerExt) {
    // 达到最大任务数，回收 worker
    if (worker.taskCount >= this.options.maxTaskPerWorker) {
      this.recycleWorker(worker);
    } else {
      this.idleWorkers.push(worker);
    }
    this.dispatchTask();
  }

  /**
   * 创建 worker
   */
  private createWorker() {
    const isTS = this.options.script.endsWith('.ts');

    const script = isTS ? `tsx ${this.options.script}` : this.options.script;
    const worker = new Worker(script, {
      argv: ['--max-old-space-size', this.options.maxMemory.toString()],
    }) as WorkerExt;

    worker.taskCount = 0;

    worker.on('error', (error) => {
      console.error(error);
    });

    /** 当 worker 退出时，重新创建一个 worker */
    worker.on('exit', () => {
      this.workers.delete(worker);

      if (!this.killed) {
        this.createWorker();
      }
    });

    this.workers.add(worker);
    this.idleWorkers.push(worker);
  }

  /**
   * 回收Worker
   */
  private recycleWorker(worker: WorkerExt) {
    worker.terminate();
  }

  /**
   * 关闭worker池
   */
  shutdown() {
    this.killed = true;
    this.workers.forEach((worker) => {
      this.recycleWorker(worker);
    });
    this.idleWorkers.forEach((worker) => {
      this.recycleWorker(worker);
    });
    this.taskQueue.forEach((task) => {
      task.reject(new Error('Worker pool closed'));
    });
  }
}
