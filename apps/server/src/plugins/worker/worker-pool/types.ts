/** Worker 执行入参 */
export type WorkerParams = {
  taskId: string;
  payload: any;
};

/** Worker 返回参数 */
export type WorkResponse = {
  type?: 'result' | 'progress' | 'ready';
  taskId: string;
  success: boolean;
  result?: any;
  error?: {
    message: string;
    stack?: string;
  };
};

/** Worker 进度消息 */
export type WorkerProgressMessage = {
  type: 'progress';
  progress: number;
  message?: string;
};

/** Worker 池配置选项 */
export type WorkerPoolOptions = {
  /** 脚本文件位置 */
  script: string;
  /** worker 池大小 */
  poolSize: number;
  /** 单任务最大重试次数 */
  retryCount: number;
  /** 重试间隔 */
  retryInterval: number;
  /** 超时时间 24h */
  timeout: number;
  /** 单个worker执行最多任务数量 */
  maxTaskPerWorker: number;
};

/** Worker 任务 */
export type WorkerTask<T> = {
  task_id: string;

  payload: T;

  retry: number;

  timeout?: number;

  resolve: (v: any) => void;

  reject: (e: Error) => void;

  onProgress?: (progress: number, message?: string) => void;
};

/** 函数执行载荷 */
export type FunctionPayload = {
  functionName: string;
  args: any[];
};
