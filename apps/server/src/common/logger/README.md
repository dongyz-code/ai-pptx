# Logger Module

基于 Pino 的高性能日志模块，支持开发环境美化输出和生产环境结构化日志。

## 功能特性

- ✅ 使用 Pino 替代 Winston，性能更优
- ✅ 开发环境美化输出（pino-pretty）
- ✅ 生产环境 JSON 结构化日志
- ✅ 自动日志文件分割（每日轮转，保留 30 天）
- ✅ 错误日志单独记录
- ✅ 支持 LOG_LEVEL 环境变量控制日志级别
- ✅ 同时输出到文件和标准输出（生产环境）

## 环境变量

- `NODE_ENV`: 环境标识（development/production）
- `LOG_LEVEL`: 日志级别（trace/debug/info/warn/error/fatal），默认 `info`

## 日志文件

生产环境下，日志文件保存在 `apps/server/logs/` 目录：

- `app.log` - 全量日志（每日轮转，gzip 压缩，保留 30 天）
- `error.log` - 错误日志（每日轮转，gzip 压缩，保留 30 天）

## 使用方式

模块已在 `AppModule` 中全局注册，可以在任何服务中注入使用：

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class YourService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(YourService.name);
  }

  someMethod() {
    this.logger.info('这是一条信息日志');
    this.logger.error('这是一条错误日志');
    this.logger.debug('这是一条调试日志');
  }
}
```

## HTTP 请求日志

HTTP 请求会自动记录（通过 pino-http），包含：
- 请求方法、URL
- 响应状态码
- 请求时长
- 客户端 IP 和端口

健康检查接口（`/health`, `/api/health`）的请求不会被记录。
