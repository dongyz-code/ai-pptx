import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service.js';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';

export type IdStrategy = 'incr' | 'xadd';

export interface IdGenerationOptions {
  strategy?: IdStrategy;
  prefix?: string;
}

@Injectable()
export class IdService {
  private readonly logger = new Logger(IdService.name);
  private readonly defaultStrategy: IdStrategy = 'incr';

  // 本地降级计数器 (进程内)
  private localCounter = 0;
  private lastCounterReset = Date.now();

  constructor(private readonly redisService: RedisService) {}

  async nextId(opts?: IdGenerationOptions): Promise<string> {
    const strategy = opts?.strategy || this.defaultStrategy;
    const prefix = opts?.prefix || '';

    try {
      let id: string;

      if (strategy === 'incr') {
        id = await this.generateIncrId();
      } else if (strategy === 'xadd') {
        id = await this.generateXaddId();
      } else {
        throw new Error(`Unknown ID generation strategy: ${strategy}`);
      }

      return prefix ? `${prefix}${id}` : id;
    } catch (error) {
      this.logger.warn(`Redis ID generation failed, falling back to local: ${error.message}`);
      const fallbackId = this.generateFallbackId();
      return prefix ? `${prefix}${fallbackId}` : fallbackId;
    }
  }

  /**
   * 本地降级 ID 生成
   * 格式: {YYYYMMDD}-L{进程内计数}-{随机4字符}
   * L 标记表示这是降级生成的 ID
   */
  private generateFallbackId(): string {
    const now = Date.now();
    const dateStr = dayjs().format('YYYYMMDD');

    // 每小时重置计数器，避免溢出
    if (now - this.lastCounterReset > 3600000) {
      this.localCounter = 0;
      this.lastCounterReset = now;
    }

    this.localCounter++;
    const random = randomBytes(2).toString('hex').toUpperCase();
    return `${dateStr}-L${this.localCounter}-${random}`;
  }

  private async generateIncrId(): Promise<string> {
    const redis = this.redisService.getClient();
    const dateStr = dayjs().format('YYYYMMDD');
    const key = `uid:${dateStr}`;

    const counter = await redis.incr(key);

    if (counter === 1) {
      await redis.expire(key, 48 * 60 * 60);
    }

    const base36Counter = counter.toString(36).toUpperCase();
    return `${dateStr}-${base36Counter}`;
  }

  private async generateXaddId(): Promise<string> {
    const redis = this.redisService.getClient();
    const streamKey = 'uid:stream';

    const streamId = await redis.xadd(streamKey, 'MAXLEN', '~', 1, '*', 'f', 'v');

    if (!streamId) {
      throw new Error('Failed to generate stream ID');
    }

    return streamId;
  }

  async batchNextId(count: number, opts?: IdGenerationOptions): Promise<string[]> {
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      const id = await this.nextId(opts);
      ids.push(id);
    }
    return ids;
  }
}
