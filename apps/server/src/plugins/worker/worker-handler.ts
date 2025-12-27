import { parentPort } from 'worker_threads';

export function workerHandler({ run }: { run: () => {} }) {
  if (!parentPort) {
    throw new Error('workerHandler: 必须在子进程执行');
  }
}
