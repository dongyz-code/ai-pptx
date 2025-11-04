import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from './id.service';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

describe('IdService', () => {
  let service: IdService;
  let mockRedis: Partial<Redis>;

  beforeEach(async () => {
    mockRedis = {
      incr: jest.fn(),
      expire: jest.fn(),
      xadd: jest.fn(),
    };

    const mockRedisService = {
      getClient: jest.fn().mockReturnValue(mockRedis),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<IdService>(IdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('nextId with incr strategy', () => {
    it('should generate ID with date prefix and base36 counter', async () => {
      (mockRedis.incr as jest.Mock).mockResolvedValue(1);
      (mockRedis.expire as jest.Mock).mockResolvedValue(1);

      const id = await service.nextId({ strategy: 'incr' });

      expect(id).toMatch(/^\d{8}-[0-9A-Z]+$/);
      expect(mockRedis.incr).toHaveBeenCalled();
      expect(mockRedis.expire).toHaveBeenCalledWith(expect.any(String), 48 * 60 * 60);
    });

    it('should apply custom prefix', async () => {
      (mockRedis.incr as jest.Mock).mockResolvedValue(1);
      (mockRedis.expire as jest.Mock).mockResolvedValue(1);

      const id = await service.nextId({ strategy: 'incr', prefix: 'order:' });

      expect(id).toMatch(/^order:\d{8}-[0-9A-Z]+$/);
    });

    it('should not set expire for subsequent calls', async () => {
      (mockRedis.incr as jest.Mock).mockResolvedValue(100);

      await service.nextId({ strategy: 'incr' });

      expect(mockRedis.expire).not.toHaveBeenCalled();
    });

    it('should convert counter to base36 uppercase', async () => {
      (mockRedis.incr as jest.Mock).mockResolvedValue(36);

      const id = await service.nextId({ strategy: 'incr' });

      expect(id).toContain('-10');
    });
  });

  describe('nextId with xadd strategy', () => {
    it('should generate ID using Redis stream', async () => {
      const mockStreamId = '1234567890123-0';
      (mockRedis.xadd as jest.Mock).mockResolvedValue(mockStreamId);

      const id = await service.nextId({ strategy: 'xadd' });

      expect(id).toBe(mockStreamId);
      expect(mockRedis.xadd).toHaveBeenCalledWith('uid:stream', 'MAXLEN', '~', 1, '*', 'f', 'v');
    });

    it('should apply custom prefix', async () => {
      const mockStreamId = '1234567890123-0';
      (mockRedis.xadd as jest.Mock).mockResolvedValue(mockStreamId);

      const id = await service.nextId({ strategy: 'xadd', prefix: 'sys:' });

      expect(id).toBe(`sys:${mockStreamId}`);
    });
  });

  describe('batchNextId', () => {
    it('should generate multiple IDs', async () => {
      (mockRedis.incr as jest.Mock).mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(3);
      (mockRedis.expire as jest.Mock).mockResolvedValue(1);

      const ids = await service.batchNextId(3);

      expect(ids).toHaveLength(3);
      expect(mockRedis.incr).toHaveBeenCalledTimes(3);
    });
  });

  describe('testConcurrency', () => {
    it('should generate unique IDs concurrently', async () => {
      let counter = 0;
      (mockRedis.incr as jest.Mock).mockImplementation(async () => ++counter);
      (mockRedis.expire as jest.Mock).mockResolvedValue(1);

      const result = await service.testConcurrency(10);

      expect(result.total).toBe(10);
      expect(result.unique).toBe(10);
      expect(result.duplicates).toBe(0);
      expect(result.ids).toHaveLength(10);
    });
  });

  describe('error handling', () => {
    it('should throw error when Redis operation fails', async () => {
      (mockRedis.incr as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await expect(service.nextId()).rejects.toThrow('Redis error');
    });

    it('should throw error for unknown strategy', async () => {
      await expect(service.nextId({ strategy: 'unknown' as any })).rejects.toThrow('Unknown ID generation strategy');
    });
  });
});
