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

#### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Server
NODE_ENV=development
PORT=3000

# Redis - Option 1: Connection URL (recommended)
REDIS_URL=redis://localhost:6379/0

# Redis - Option 2: Individual settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TLS=false
```

#### Configuration File

Edit `.conf/conf.json` for additional configuration:

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

**Note**: Environment variables take precedence over config file values.

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
      prefix: 'order:' 
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

### Environment Variables (Production)

```bash
NODE_ENV=production
PORT=3000

# Redis with TLS
REDIS_URL=rediss://username:password@redis.example.com:6379/0

# Or
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=strongpassword
REDIS_TLS=true
```

### Docker Deployment

Build production image:

```bash
docker build -t ai-pptx-server:latest -f .dockerfile .
```

Run container:

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e REDIS_URL=redis://redis:6379 \
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

If you see `Failed to connect to Redis` errors:

1. Verify Redis is running:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Check connection settings:
   ```bash
   echo $REDIS_URL
   # or
   echo $REDIS_HOST
   ```

3. Test connection manually:
   ```bash
   redis-cli -h localhost -p 6379 ping
   ```

4. Check Redis logs for authentication issues

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
