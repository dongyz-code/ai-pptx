# Logger Module

基于 Pino 的高性能日志模块，支持开发环境美化输出和生产环境结构化日志。

## 功能特性

- ✅ 使用 Pino 替代 Winston，性能更优
- ✅ **自动区分开发/生产环境**
  - 开发环境：美化输出到控制台（pino-pretty）
  - 生产环境：JSON 格式写入文件 + 控制台
- ✅ **自动日志文件写入**（生产环境）
  - 每日轮转，gzip 压缩
  - 保留 30 天
  - 错误日志单独记录
- ✅ 支持 LOG_LEVEL 环境变量控制日志级别
- ✅ **预留 Elasticsearch 写入接口**
- ✅ 全局可用，无需在每个模块中导入

## 环境变量

- `NODE_ENV`: 环境标识（development/production）
- `LOG_LEVEL`: 日志级别（trace/debug/info/warn/error/fatal），默认 `info`

## 日志文件

生产环境下，日志文件自动保存在 `apps/server/logs/` 目录：

- `app.log` - 全量日志（每日轮转，gzip 压缩，保留 30 天）
- `error.log` - 错误日志（每日轮转，gzip 压缩，保留 30 天）

开发环境下，日志仅输出到控制台，不写入文件。

## 使用方式

### 基本使用

模块已在 `AppModule` 中全局注册，可以在任何服务中注入使用：

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';

@Injectable()
export class YourService {
  constructor(@Inject(Logger) private readonly logger: Logger) {
    this.logger.setContext(YourService.name);
  }

  someMethod() {
    this.logger.info('这是一条信息日志');
    this.logger.log('这也是一条信息日志（log 方法等同于 info）');
    this.logger.error('这是一条错误日志');
    this.logger.warn('这是一条警告日志');
    this.logger.debug('这是一条调试日志');
  }
}
```

### 配置 Elasticsearch（可选）

如果需要将日志发送到 Elasticsearch，可以配置 ES 传输：

```typescript
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';

@Injectable()
export class YourService implements OnModuleInit {
  constructor(@Inject(Logger) private readonly logger: Logger) {
    this.logger.setContext(YourService.name);
  }

  onModuleInit() {
    // 配置 Elasticsearch（仅在生产环境生效）
    this.logger.configureElasticsearch({
      node: 'http://localhost:9200',
      index: 'app-logs',
      auth: {
        username: 'elastic',
        password: 'password',
      },
    });
  }

  someMethod() {
    // 日志会自动写入文件和 ES
    this.logger.info('这条日志会被发送到 ES');
  }
}
```

## Logger API

自定义 Logger 服务提供以下方法：

- `setContext(context: string)` - 设置日志上下文（通常是类名）
- `log(message: string, ...args)` - 记录信息日志（等同于 info）
- `info(message: string, ...args)` - 记录信息日志
- `error(message: string, trace?: string, ...args)` - 记录错误日志
- `warn(message: string, ...args)` - 记录警告日志
- `debug(message: string, ...args)` - 记录调试日志
- `verbose(message: string, ...args)` - 记录详细日志
- `configureElasticsearch(options)` - 配置 Elasticsearch 传输（可选）

## 环境差异

### 开发环境 (NODE_ENV !== 'production')

- ✅ 美化输出到控制台
- ✅ 彩色日志
- ✅ 易于阅读的格式
- ❌ 不写入文件
- ❌ 不发送到 ES

### 生产环境 (NODE_ENV === 'production')

- ✅ JSON 格式输出
- ✅ 写入日志文件（app.log + error.log）
- ✅ 同时输出到控制台
- ✅ 日志文件自动轮转
- ✅ 可选发送到 Elasticsearch

## HTTP 请求日志

HTTP 请求会自动记录（通过 pino-http），包含：

- 请求方法、URL
- 响应状态码
- 请求时长
- 客户端 IP 和端口

健康检查接口（`/health`, `/api/health`）的请求不会被记录。

## Elasticsearch 集成

Logger 预留了 Elasticsearch 写入接口，可以通过以下步骤启用：

1. 安装 Elasticsearch 客户端：

   ```bash
   pnpm add @elastic/elasticsearch
   ```

2. 在 `logger.transport.ts` 中实现 `bulkWrite` 方法

3. 在服务中配置 ES 连接信息

4. 日志会自动异步写入 ES（不阻塞主流程）

## 注意事项

- Logger 使用 `Scope.TRANSIENT`，每个注入点都有独立实例
- ES 写入失败不会影响主流程
- 开发环境下不会写入 ES，避免污染数据
- 日志文件路径：`apps/server/logs/`
