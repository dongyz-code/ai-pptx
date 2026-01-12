# Worker Pool

一个基于 Node.js Worker Threads 的高性能工作池实现，用于执行 CPU 密集型任务。

## 特性

- ✅ **自动负载均衡**: 智能调度任务到空闲的 worker
- ✅ **任务重试**: 支持失败任务自动重试
- ✅ **超时控制**: 防止任务无限期执行
- ✅ **内存管理**: 可配置单个 worker 的最大内存
- ✅ **Worker 回收**: 自动回收执行过多任务的 worker
- ✅ **进度报告**: 支持任务执行进度回调
- ✅ **函数调用**: 支持直接调用 worker 脚本中导出的函数
- ✅ **TypeScript**: 完整的类型支持

## 安装

```bash
pnpm install
```

## 快速开始

### 使用 `execFunction` 执行导出的函数

这是推荐的使用方式，适合需要在 worker 中执行多个不同函数的场景。

**步骤 1: 创建 worker 脚本**

```typescript
// math-worker.ts
export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function factorial(n: number): bigint {
  if (n === 0 || n === 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }
  return result;
}
```

**步骤 2: 创建 worker 池并执行函数**

```typescript
import { WorkerPool } from './worker-pool';

const pool = new WorkerPool({
  script: './math-worker.ts', // 开发环境使用 .ts
  // script: './math-worker.js', // 生产环境使用 .js
  poolSize: 4,
});

// 执行 fibonacci 函数
const fib = await pool.execFunction('fibonacci', [30]);
console.log('fibonacci(30) =', fib);

// 执行 factorial 函数
const fact = await pool.execFunction('factorial', [20]);
console.log('factorial(20) =', fact.toString());

// 关闭池
pool.shutdown();
```

### 开发环境 vs 生产环境

**开发环境 (TypeScript)**:
- Worker 脚本使用 `.ts` 扩展名
- 自动使用 `tsx` loader 加载 TypeScript 文件
- 无需编译即可运行

```typescript
const pool = new WorkerPool({
  script: './worker.ts', // 自动使用 tsx loader
});
```

**生产环境 (JavaScript)**:
- Worker 脚本使用 `.js` 扩展名
- 直接加载编译后的 JavaScript 文件
- 性能更好，无需运行时编译

```typescript
const pool = new WorkerPool({
  script: './worker.js', // 使用编译后的 .js 文件
});
```

**推荐做法**:

```typescript
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 根据环境自动选择文件扩展名
const isDev = process.env.NODE_ENV !== 'production';
const ext = isDev ? '.ts' : '.js';

const pool = new WorkerPool({
  script: join(__dirname, `./worker${ext}`),
  poolSize: 4,
});
```


## 进度报告

Worker 可以向主线程报告执行进度。

**在 worker 中报告进度:**

```typescript
// worker.ts
import { sendProgress } from './worker-pool';

export async function findPrimes(start: number, end: number): Promise<number[]> {
  const primes: number[] = [];
  const total = end - start;

  for (let i = start; i <= end; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }

    // 每 1000 个数字报告一次进度
    if ((i - start) % 1000 === 0) {
      const progress = ((i - start) / total) * 100;
      sendProgress(progress, `已检查 ${i - start} 个数字`);
    }
  }

  sendProgress(100, '完成');
  return primes;
}
```

**在主线程接收进度:**

```typescript
const primes = await pool.execFunction(
  'findPrimes',
  [1, 100000],
  (progress, message) => {
    console.log(`进度: ${progress.toFixed(2)}% - ${message}`);
  },
);
```

## 配置选项

```typescript
interface WorkerPoolOptions {
  /** Worker 脚本文件路径 (必需) */
  script: string;

  /** Worker 池大小，默认为 CPU 核心数 - 2 */
  poolSize?: number;

  /** 单任务最大重试次数，默认 3 */
  retryCount?: number;

  /** 重试间隔 (ms)，默认 1000 */
  retryInterval?: number;

  /** 任务超时时间 (ms)，默认 60000 (1分钟) */
  timeout?: number;

  /** Worker 最大内存 (MB)，默认 2048 */
  maxMemory?: number;

  /** 单个 worker 执行最多任务数量，默认 30 */
  maxTaskPerWorker?: number;
}
```

## API 文档

### WorkerPool

#### `constructor(options: WorkerPoolOptions)`

创建一个新的 worker 池。

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  poolSize: 4,
  timeout: 30000,
});
```

#### `execFunction<Args, Result>(functionName: string, args: Args, onProgress?: ProgressCallback): Promise<Result>`

执行 worker 脚本中导出的函数。

- `functionName`: 要执行的函数名
- `args`: 函数参数数组
- `onProgress`: 可选的进度回调函数
- 返回: Promise，解析为函数返回值

```typescript
const result = await pool.execFunction('myFunction', [arg1, arg2]);
```

#### `getStatus(): PoolStatus`

获取池的当前状态。

```typescript
const status = pool.getStatus();
console.log(status);
// {
//   totalWorkers: 4,
//   idleWorkers: 2,
//   busyWorkers: 2,
//   queuedTasks: 5,
//   killed: false
// }
```

#### `shutdown(): void`

关闭 worker 池，终止所有 worker 并拒绝所有待处理的任务。

```typescript
pool.shutdown();
```

### sendProgress

在 worker 中向主线程发送进度更新。

```typescript
import { sendProgress } from './worker-pool';

sendProgress(50, '已完成一半');
```

## 完整示例

### 示例 1: 并发计算

```typescript
import { WorkerPool } from './worker-pool';

const pool = new WorkerPool({
  script: './math-worker.ts',
  poolSize: 4,
});

// 并发执行多个任务
const tasks = [
  pool.execFunction('fibonacci', [35]),
  pool.execFunction('fibonacci', [36]),
  pool.execFunction('fibonacci', [37]),
  pool.execFunction('fibonacci', [38]),
];

const results = await Promise.all(tasks);
console.log('结果:', results);

pool.shutdown();
```

### 示例 2: 带进度的长时间任务

```typescript
import { WorkerPool } from './worker-pool';

const pool = new WorkerPool({
  script: './data-processor.ts',
  poolSize: 2,
  timeout: 300000, // 5 分钟
});

const result = await pool.execFunction(
  'processLargeDataset',
  [datasetPath],
  (progress, message) => {
    console.log(`[${progress.toFixed(1)}%] ${message}`);
  },
);

console.log('处理完成:', result);
pool.shutdown();
```

### 示例 3: 错误处理和重试

```typescript
import { WorkerPool } from './worker-pool';

const pool = new WorkerPool({
  script: './unreliable-worker.ts',
  poolSize: 2,
  retryCount: 5, // 最多重试 5 次
  retryInterval: 2000, // 重试间隔 2 秒
});

try {
  const result = await pool.execFunction('riskyOperation', [data]);
  console.log('成功:', result);
} catch (error) {
  console.error('失败:', error.message);
}

pool.shutdown();
```

## 最佳实践

### 1. 选择合适的池大小

```typescript
import os from 'os';

// 对于 CPU 密集型任务，使用 CPU 核心数
const cpuIntensivePool = new WorkerPool({
  script: './cpu-worker.ts',
  poolSize: os.cpus().length,
});

// 对于 I/O 密集型任务，可以使用更多 worker
const ioIntensivePool = new WorkerPool({
  script: './io-worker.ts',
  poolSize: os.cpus().length * 2,
});
```

### 2. 合理设置超时时间

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  timeout: 60000, // 1 分钟
});
```

### 3. 监控池状态

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  poolSize: 4,
});

// 定期检查状态
setInterval(() => {
  const status = pool.getStatus();
  if (status.queuedTasks > 100) {
    console.warn('任务队列过长，考虑增加 worker 数量');
  }
}, 5000);
```

### 4. 优雅关闭

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  poolSize: 4,
});

// 监听进程退出信号
process.on('SIGTERM', () => {
  console.log('正在关闭 worker 池...');
  pool.shutdown();
  process.exit(0);
});
```

### 5. 错误处理

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  poolSize: 4,
});

try {
  const result = await pool.execFunction('processData', [data]);
  console.log('成功:', result);
} catch (error) {
  if (error.message === 'Task timeout') {
    console.error('任务超时');
  } else if (error.message === 'Worker pool closed') {
    console.error('Worker 池已关闭');
  } else {
    console.error('任务失败:', error);
  }
}
```

## 性能建议

1. **避免频繁创建和销毁池**: 复用 worker 池以减少开销
2. **合理设置 `maxTaskPerWorker`**: 防止 worker 内存泄漏
3. **使用进度报告**: 对于长时间运行的任务，使用进度报告提供反馈
4. **批量处理**: 将多个小任务合并为一个大任务以减少通信开销
5. **监控内存使用**: 使用 `maxMemory` 限制单个 worker 的内存使用

## 故障排查

### Worker 无法启动

确保 worker 脚本路径正确，并且使用了正确的 TypeScript 加载器。

```typescript
const pool = new WorkerPool({
  script: path.resolve(__dirname, './worker.ts'),
  poolSize: 4,
});
```

### 任务超时

增加超时时间或优化 worker 代码。

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  timeout: 120000, // 增加到 2 分钟
});
```

### 内存泄漏

设置 `maxTaskPerWorker` 以定期回收 worker。

```typescript
const pool = new WorkerPool({
  script: './worker.ts',
  maxTaskPerWorker: 50, // 每个 worker 最多执行 50 个任务
});
```

## 架构说明

### 文件结构

```
worker-pool/
├── worker-pool.ts        # WorkerPool 主类，管理 worker 池
├── worker-bootstrap.ts   # Worker 启动文件，加载用户脚本并执行函数
├── types.ts             # TypeScript 类型定义
├── index.ts             # 导出接口
└── README.md            # 本文档
```

### 工作流程

1. **初始化**: `WorkerPool` 创建指定数量的 worker 线程
2. **任务提交**: 用户调用 `execFunction()` 提交任务
3. **任务调度**: 池将任务分配给空闲的 worker
4. **任务执行**: Worker 加载用户脚本，执行指定的导出函数
5. **结果返回**: 主线程接收结果并解析 Promise
6. **Worker 回收**: 达到最大任务数的 worker 被终止并重新创建

### 设计原则

- **单一职责**: 只支持 function 模式，职责清晰
- **类型安全**: 完整的 TypeScript 类型支持
- **简单易用**: 用户只需导出函数，无需额外配置
- **高性能**: 自动负载均衡和 worker 回收机制

## 许可证

MIT

## 作者

yuzhong.dong
