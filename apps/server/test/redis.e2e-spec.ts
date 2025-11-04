import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Redis and ID Generation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status including Redis', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('info');
          expect(res.body.info).toHaveProperty('redis');
        });
    });
  });

  describe('/ids/next (GET)', () => {
    it('should generate a unique ID with default strategy', () => {
      return request(app.getHttpServer())
        .get('/api/ids/next')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('strategy', 'incr');
          expect(res.body.id).toMatch(/^\d{8}-[0-9A-Z]+$/);
        });
    });

    it('should generate ID with incr strategy', () => {
      return request(app.getHttpServer())
        .get('/api/ids/next?strategy=incr')
        .expect(200)
        .expect((res) => {
          expect(res.body.strategy).toBe('incr');
          expect(res.body.id).toMatch(/^\d{8}-[0-9A-Z]+$/);
        });
    });

    it('should generate ID with xadd strategy', () => {
      return request(app.getHttpServer())
        .get('/api/ids/next?strategy=xadd')
        .expect(200)
        .expect((res) => {
          expect(res.body.strategy).toBe('xadd');
          expect(res.body.id).toMatch(/^\d+-\d+$/);
        });
    });

    it('should apply custom prefix', () => {
      return request(app.getHttpServer())
        .get('/api/ids/next?prefix=test:')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toMatch(/^test:\d{8}-[0-9A-Z]+$/);
        });
    });
  });

  describe('/ids/batch (GET)', () => {
    it('should generate multiple IDs', () => {
      return request(app.getHttpServer())
        .get('/api/ids/batch?count=5')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('count', 5);
          expect(res.body.ids).toHaveLength(5);
        });
    });

    it('should generate batch with default count', () => {
      return request(app.getHttpServer())
        .get('/api/ids/batch')
        .expect(200)
        .expect((res) => {
          expect(res.body.count).toBe(10);
          expect(res.body.ids).toHaveLength(10);
        });
    });
  });

  describe('/ids/test-concurrency (GET)', () => {
    it('should generate unique IDs under concurrent load', () => {
      return request(app.getHttpServer())
        .get('/api/ids/test-concurrency?concurrent=20')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body.total).toBe(20);
          expect(res.body.unique).toBe(20);
          expect(res.body.duplicates).toBe(0);
          expect(res.body.ids).toHaveLength(20);
        });
    });
  });
});
