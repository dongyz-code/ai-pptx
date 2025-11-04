import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import * as dayjs from 'dayjs';

export type IdStrategy = 'incr' | 'xadd';

export interface IdGenerationOptions {
  strategy?: IdStrategy;
  prefix?: string;
}

@Injectable()
export class IdService {
  private readonly logger = new Logger(IdService.name);
  private readonly defaultStrategy: IdStrategy = 'incr';

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
      this.logger.error(`Failed to generate ID: ${error.message}`);
      throw error;
    }
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

  async testConcurrency(concurrent: number = 10): Promise<{
    total: number;
    unique: number;
    duplicates: number;
    ids: string[];
  }> {
    const promises = Array.from({ length: concurrent }, () => this.nextId());
    const ids = await Promise.all(promises);
    const uniqueIds = new Set(ids);

    return {
      total: ids.length,
      unique: uniqueIds.size,
      duplicates: ids.length - uniqueIds.size,
      ids,
    };
  }
}
