import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { nestLogger } from './lib/logger.js';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  app.useLogger(nestLogger);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
