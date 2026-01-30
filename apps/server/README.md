# AI PPTX Server

NestJS (Fastify) server for the AI PowerPoint editor application.

## Features

- **NestJS Framework** with Fastify adapter for high performance
- **Redis Integration** for caching and distributed ID generation
- **Health Checks** via `/api/health` endpoint
- **Logging** with Pino (nestjs-pino)
- **Configuration Management** with environment variables and config files
- **TypeScript** with ES modules

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Redis (for ID generation and caching)

### Installation

```bash
# Install dependencies (from monorepo root)
pnpm install

# Or install in server directory
cd apps/server
pnpm install
```

### Configuration

所有配置都通过 `.conf/conf.json` 文件管理。编辑该文件以配置应用：

```json
{
  "app": {
    "port": 3000,
    "environment": "development",
    "jwtSecret": "test-secret",
    "jwtExpiresIn": "7d"
  },
  "pg": {
    "host": "localhost",
    "port": 5432,
    "database": "test",
    "user": "test",
    "password": "test",
    "schema": "public"
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "username": "",
    "password": ""
  }
}
```

#### Redis 配置说明

- `host`: Redis 服务器地址
- `port`: Redis 端口（默认 6379）
- `username`: Redis 用户名（可选）
- `password`: Redis 密码（可选）

环境变量（如 `NODE_ENV` 和 `PORT`）可通过 `.env` 文件或系统环境变量设置。

### Running the Server

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start:prod
```

### Docker

Run Redis locally with Docker:

```bash
docker run -d -p 6379:6379 redis:alpine
```

Build and run the server:

```bash
pnpm docker:build
```

## API Endpoints

### System

- `GET /api/system/sign` - Get system signature
- `POST /api/system/login` - User login
- `POST /api/system/logout` - User logout

### Health

- `GET /api/health` - Health check (includes Redis status)

### ID Generation

- `GET /api/ids/next` - Generate a unique ID
  - Query params: `?strategy=incr|xadd&prefix=custom:`
- `GET /api/ids/batch` - Generate multiple IDs
  - Query params: `?count=10&strategy=incr&prefix=custom:`
- `GET /api/ids/test-concurrency` - Test concurrent ID generation
  - Query params: `?concurrent=100`

Example:

```bash
# Health check
curl http://localhost:3000/api/health

# Generate ID
curl http://localhost:3000/api/ids/next

# Generate ID with prefix
curl "http://localhost:3000/api/ids/next?prefix=order:"

# Test concurrency
curl "http://localhost:3000/api/ids/test-concurrency?concurrent=50"
```

## Modules

### Redis Module

Provides Redis connection and unique ID generation.

**Features**:

- Automatic connection management with reconnection
- Two ID generation strategies:
  - **incr**: Date-prefixed incremental IDs (default, recommended)
  - **xadd**: Redis Stream-based timestamp IDs
- Health check integration
- Global module (available everywhere)

**Documentation**: See [src/module/redis/README.md](./src/module/redis/README.md)

**Usage Example**:

```typescript
import { Injectable } from '@nestjs/common';
import { IdService } from './module/redis';

@Injectable()
export class MyService {
  constructor(private readonly idService: IdService) {}

  async createOrder() {
    const orderId = await this.idService.nextId({
      strategy: 'incr',
      prefix: 'order:',
    });
    console.log(orderId); // e.g., "order:20251104-1L2"
  }
}
```

### System Module

Basic system endpoints for authentication and configuration.

### Health Module

Provides health check endpoints with Redis status monitoring.

## Development

### Scripts

```bash
# Development with hot reload
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Test
pnpm test
pnpm test:watch
pnpm test:cov

# E2E Tests
pnpm test:e2e
```

### Project Structure

```
apps/server/
├── .conf/              # Configuration files
├── src/
│   ├── common/         # Shared utilities
│   │   ├── config/     # Configuration module
│   │   └── logger/     # Logger module
│   ├── module/         # Feature modules
│   │   ├── redis/      # Redis & ID generation
│   │   ├── health/     # Health checks
│   │   ├── ids/        # ID generation endpoints
│   │   └── system/     # System endpoints
│   ├── utils/          # Utility functions
│   ├── app.module.ts   # Root module
│   ├── main.ts         # Entry point
│   └── env.d.ts        # Environment types
├── test/               # E2E tests
├── nest-cli.json       # NestJS CLI config
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test id.service.spec

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

### E2E Tests

```bash
pnpm test:e2e
```

## Deployment

### Prerequisites

- Redis instance (standalone or cluster)
- Node.js 18+ runtime
- Environment variables configured

### 生产环境配置

在生产环境中，编辑 `.conf/conf.json` 文件：

```json
{
  "app": {
    "port": 3000,
    "environment": "production",
    "jwtSecret": "your-production-secret",
    "jwtExpiresIn": "7d"
  },
  "redis": {
    "host": "redis.example.com",
    "port": 6379,
    "username": "your-username",
    "password": "your-strong-password"
  }
}
```

环境变量：

```bash
NODE_ENV=production
PORT=3000
```

### Docker Deployment

Build production image:

```bash
docker build -t ai-pptx-server:latest -f .dockerfile .
```

Run container (需要挂载配置文件):

```bash
docker run -d \
  -p 3000:3000 \
  -v /path/to/conf:/app/.conf \
  -e NODE_ENV=production \
  ai-pptx-server:latest
```

### Health Monitoring

Monitor the health endpoint:

```bash
curl http://your-server:3000/api/health
```

Expected response when healthy:

```json
{
  "status": "ok",
  "info": {
    "redis": {
      "status": "up"
    }
  }
}
```

## Troubleshooting

### Redis Connection Issues

如果看到 `Failed to connect to Redis` 错误：

1. 验证 Redis 正在运行:

   ```bash
   redis-cli ping
   # 应该返回: PONG
   ```

2. 检查配置文件 `.conf/conf.json` 中的 Redis 配置:

   ```json
   {
     "redis": {
       "host": "localhost",
       "port": 6379,
       "username": "",
       "password": ""
     }
   }
   ```

3. 手动测试连接:

   ```bash
   redis-cli -h localhost -p 6379 ping
   ```

4. 检查 Redis 日志以排查认证问题

### Port Already in Use

If port 3000 is already in use:

```bash
# Change port
export PORT=3001
pnpm dev
```

Or update `.conf/conf.json`:

```json
{
  "app": {
    "port": 3001
  }
}
```

## License

UNLICENSED - Private project
