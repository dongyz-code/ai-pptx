/**
 * @description Worker Pool 使用示例
 * 演示如何使用 WorkerPool 执行任务
 */

import { WorkerPool } from '../worker-pool/worker-pool.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 示例 1: 使用 execFunction 执行导出的函数
async function example1() {
  console.log('\n=== 示例 1: 执行导出的函数 ===');

  const pool = new WorkerPool({
    script: join(__dirname, 'math-worker.js'),
    poolSize: 2,
  });

  try {
    // 计算斐波那契数
    const fib = await pool.execFunction('fibonacci', [30]);
    console.log('fibonacci(30) =', fib);

    // 计算阶乘
    const fact = await pool.execFunction('factorial', [20]);
    console.log('factorial(20) =', fact.toString());

    // 查找质数（带进度）
    console.log('\n查找 1-10000 之间的质数...');
    const primes = await pool.execFunction('findPrimes', [1, 10000], (progress, message) => {
      console.log(`进度: ${progress.toFixed(2)}% - ${message}`);
    });
    console.log(`找到 ${primes.length} 个质数`);
  } finally {
    pool.shutdown();
  }
}

// 示例 2: 执行字符串处理函数
async function example2() {
  console.log('\n=== 示例 2: 字符串处理 ===');

  const pool = new WorkerPool({
    script: join(__dirname, 'simple-worker.js'),
    poolSize: 2,
  });

  try {
    // 哈希
    const hash = await pool.execFunction('hash', ['Hello World']);
    console.log('Hash:', hash);

    // 压缩
    const compressed = await pool.execFunction('compress', ['aaabbbccc']);
    console.log('Compressed:', compressed);

    // 加密
    const encrypted = await pool.execFunction('encrypt', ['Hello World']);
    console.log('Encrypted:', encrypted);
  } finally {
    pool.shutdown();
  }
}

// 示例 3: 并发执行多个任务
async function example3() {
  console.log('\n=== 示例 3: 并发执行 ===');

  const pool = new WorkerPool({
    script: join(__dirname, 'math-worker.js'),
    poolSize: 4,
  });

  try {
    const tasks = [
      pool.execFunction('fibonacci', [35]),
      pool.execFunction('fibonacci', [36]),
      pool.execFunction('fibonacci', [37]),
      pool.execFunction('fibonacci', [38]),
    ];

    console.log('开始并发执行 4 个任务...');
    const start = Date.now();
    const results = await Promise.all(tasks);
    const duration = Date.now() - start;

    console.log('结果:', results);
    console.log(`耗时: ${duration}ms`);
  } finally {
    pool.shutdown();
  }
}

// 示例 4: 监控池状态
async function example4() {
  console.log('\n=== 示例 4: 监控池状态 ===');

  const pool = new WorkerPool({
    script: join(__dirname, 'math-worker.js'),
    poolSize: 2,
  });

  try {
    console.log('初始状态:', pool.getStatus());

    // 提交多个任务
    const tasks = Array.from({ length: 5 }, (_, i) => pool.execFunction('heavyTask', [1000]));

    // 定期检查状态
    const statusInterval = setInterval(() => {
      console.log('当前状态:', pool.getStatus());
    }, 500);

    await Promise.all(tasks);
    clearInterval(statusInterval);

    console.log('最终状态:', pool.getStatus());
  } finally {
    pool.shutdown();
  }
}

// 运行所有示例
async function main() {
  try {
    await example1();
    await example2();
    await example3();
    await example4();
  } catch (error) {
    console.error('错误:', error);
  }
}

main();
