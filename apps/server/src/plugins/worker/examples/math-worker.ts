/**
 * @description 数学计算 Worker 示例
 * 演示如何导出多个函数供 WorkerPool 调用
 */

import { sendProgress } from '../worker-pool/worker-helpers.js';

/**
 * 计算斐波那契数列
 */
export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * 计算质数
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * 计算范围内的所有质数
 */
export async function findPrimes(start: number, end: number): Promise<number[]> {
  const primes: number[] = [];
  const total = end - start;

  for (let i = start; i <= end; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }

    // 报告进度
    if ((i - start) % 1000 === 0) {
      const progress = ((i - start) / total) * 100;
      sendProgress(progress, `已检查 ${i - start} 个数字`);
    }
  }

  sendProgress(100, '完成');
  return primes;
}

/**
 * 计算阶乘
 */
export function factorial(n: number): bigint {
  if (n < 0) throw new Error('负数没有阶乘');
  if (n === 0 || n === 1) return BigInt(1);

  let result = BigInt(1);
  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }
  return result;
}

/**
 * 模拟耗时任务
 */
export async function heavyTask(duration: number): Promise<string> {
  const start = Date.now();
  let count = 0;

  while (Date.now() - start < duration) {
    count++;
    // 模拟 CPU 密集型计算
    Math.sqrt(count);

    // 每 100ms 报告一次进度
    if (count % 100000 === 0) {
      const elapsed = Date.now() - start;
      const progress = (elapsed / duration) * 100;
      sendProgress(Math.min(progress, 100), `已运行 ${elapsed}ms`);
    }
  }

  return `任务完成，执行了 ${count} 次计算`;
}
