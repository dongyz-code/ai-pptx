import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
