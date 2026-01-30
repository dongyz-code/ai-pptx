import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '../logger/logger.service.js';
import { RedisService } from '../redis/redis.service.js';

/**
 * 缓存服务 - 基于Redis的缓存封装
 */
@Injectable()
export class CacheService {
  private readonly defaultTTL = 300; // 默认5分钟

  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly redisService: RedisService
  ) {
    this.logger.setContext(CacheService.name);
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisService.getClient().get(this.prefixKey(key));
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.warn(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await this.redisService.getClient().setex(this.prefixKey(key), ttl, data);
    } catch (error) {
      this.logger.warn(`Cache set error for key ${key}: ${error.message}`);
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisService.getClient().del(this.prefixKey(key));
    } catch (error) {
      this.logger.warn(`Cache del error for key ${key}: ${error.message}`);
    }
  }

  /**
   * 删除匹配模式的缓存
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisService.getClient().keys(this.prefixKey(pattern));
      if (keys.length > 0) {
        await this.redisService.getClient().del(...keys);
      }
    } catch (error) {
      this.logger.warn(`Cache delByPattern error for pattern ${pattern}: ${error.message}`);
    }
  }

  /**
   * 缓存旁路模式 - 如果缓存不存在则执行factory并缓存结果
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache hit for key: ${key}`);
      return cached;
    }

    this.logger.debug(`Cache miss for key: ${key}`);
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * 添加缓存key前缀
   */
  private prefixKey(key: string): string {
    return `cache:${key}`;
  }
}
