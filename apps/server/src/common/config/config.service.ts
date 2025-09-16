import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { GetTypeByPath, Paths } from '@pkg/types';
import type { getConfig } from './configuration.js';

type AppConfig = ReturnType<typeof getConfig>;

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get<T extends Paths<AppConfig>>(path: T): GetTypeByPath<AppConfig, T> {
    return this.configService.get(path, { infer: true }) as any;
  }
}
