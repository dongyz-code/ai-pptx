import { RedisOptions } from 'ioredis';

export interface RedisModuleOptions {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  tls?: boolean;
  keyPrefix?: string;
}

export function getRedisOptions(): RedisOptions {
  if (process.env.REDIS_URL) {
    return {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };
  }

  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
  const password = process.env.REDIS_PASSWORD || undefined;
  const db = process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0;
  const tls = process.env.REDIS_TLS === 'true';

  return {
    host,
    port,
    password,
    db,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    ...(tls && { tls: {} }),
  };
}
