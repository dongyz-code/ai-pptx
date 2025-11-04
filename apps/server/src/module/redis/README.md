# Redis Module

This module provides Redis connection management and unique ID generation capabilities for the NestJS server.

## Features

- Redis connection with automatic reconnection
- Health check support via `/api/health`
- Two ID generation strategies:
  - **Strategy A (incr)**: Date-prefixed incremental IDs (default, recommended)
  - **Strategy B (xadd)**: Redis Stream-based IDs
- Concurrent-safe ID generation
- Global module - available throughout the application

## Installation

Dependencies are already installed:
- `ioredis` - Redis client
- `@nestjs/terminus` - Health check support

## Configuration

### Environment Variables

Configure Redis connection using environment variables:

#### Option 1: Using REDIS_URL (Recommended)
```bash
REDIS_URL=redis://username:password@host:6379/0
# Or with TLS
REDIS_URL=rediss://username:password@host:6379/0
```

#### Option 2: Using Individual Variables
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=mypassword
REDIS_DB=0
REDIS_TLS=true  # Optional, set to 'true' to enable TLS
```

### Configuration File

The module also supports configuration via `.conf/conf.json`:

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

**Note**: Environment variables take precedence over configuration file values.

## Usage

### Inject Services

Since `RedisModule` is a global module, you can inject `RedisService` and `IdService` anywhere:

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService, IdService } from '../redis';

@Injectable()
export class MyService {
  constructor(
    private readonly redisService: RedisService,
    private readonly idService: IdService,
  ) {}

  async example() {
    // Use Redis client directly
    const redis = this.redisService.getClient();
    await redis.set('key', 'value');
    
    // Generate unique IDs
    const id = await this.idService.nextId();
    console.log(id); // e.g., "20251104-1"
  }
}
```

### ID Generation

#### Basic Usage

```typescript
// Generate ID with default strategy (incr)
const id = await this.idService.nextId();
// Result: "20251104-1"
```

#### Strategy A: Incremental with Date Prefix (Default)

This strategy uses Redis `INCR` to generate sequential IDs with date prefix:

```typescript
const id = await this.idService.nextId({ strategy: 'incr' });
// Result: "20251104-1L2"
```

**Format**: `{YYYYMMDD}-{base36(counter)}`
- Date changes daily
- Counter is base36-encoded (0-9, A-Z)
- Keys expire after 48 hours
- Zero storage overhead (keys auto-expire)
- Sortable and sequential

**Benefits**:
- Human-readable with date information
- No storage overhead (auto-expiring keys)
- Highly performant (single Redis operation)
- Suitable for high-concurrency scenarios

#### Strategy B: Redis Stream-based

This strategy uses Redis Streams `XADD` to generate timestamp-based IDs:

```typescript
const id = await this.idService.nextId({ strategy: 'xadd' });
// Result: "1730678901234-0"
```

**Format**: `{timestamp-ms}-{sequence}`
- Timestamp in milliseconds
- Auto-incrementing sequence for same millisecond
- Minimal storage (MAXLEN ~ 1)

**Benefits**:
- Precise timestamp embedded
- Redis-native generation
- Suitable for distributed systems

#### Custom Prefix

Add a custom prefix to generated IDs:

```typescript
const orderId = await this.idService.nextId({ 
  strategy: 'incr', 
  prefix: 'order:' 
});
// Result: "order:20251104-1L2"

const userId = await this.idService.nextId({ 
  strategy: 'incr', 
  prefix: 'user:' 
});
// Result: "user:20251104-1L3"
```

#### Batch Generation

Generate multiple IDs at once:

```typescript
const ids = await this.idService.batchNextId(10, { 
  strategy: 'incr',
  prefix: 'doc:' 
});
// Result: ["doc:20251104-1", "doc:20251104-2", ...]
```

### Direct Redis Access

Access the Redis client directly for custom operations:

```typescript
const redis = this.redisService.getClient();

// Set value
await redis.set('mykey', 'myvalue');

// Get value
const value = await redis.get('mykey');

// Hash operations
await redis.hset('user:1', 'name', 'John');
await redis.hset('user:1', 'email', 'john@example.com');
const user = await redis.hgetall('user:1');

// Pub/Sub
await redis.publish('events', JSON.stringify({ type: 'user.created' }));
```

### Health Check

The module automatically registers a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "info": {
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "redis": {
      "status": "up"
    }
  }
}
```

## API Endpoints

The module provides example endpoints for ID generation:

### GET /api/ids/next

Generate a single ID.

**Query Parameters**:
- `strategy` (optional): `'incr'` or `'xadd'` (default: `'incr'`)
- `prefix` (optional): Custom prefix string

**Example**:
```bash
curl "http://localhost:3000/api/ids/next"
curl "http://localhost:3000/api/ids/next?strategy=xadd"
curl "http://localhost:3000/api/ids/next?strategy=incr&prefix=order:"
```

**Response**:
```json
{
  "success": true,
  "id": "20251104-1L2",
  "strategy": "incr",
  "timestamp": "2025-11-04T10:30:00.000Z"
}
```

### GET /api/ids/batch

Generate multiple IDs.

**Query Parameters**:
- `count` (optional): Number of IDs to generate (default: 10)
- `strategy` (optional): `'incr'` or `'xadd'`
- `prefix` (optional): Custom prefix string

**Example**:
```bash
curl "http://localhost:3000/api/ids/batch?count=5"
curl "http://localhost:3000/api/ids/batch?count=5&prefix=doc:"
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "ids": ["20251104-1", "20251104-2", "20251104-3", "20251104-4", "20251104-5"],
  "strategy": "incr",
  "timestamp": "2025-11-04T10:30:00.000Z"
}
```

### GET /api/ids/test-concurrency

Test concurrent ID generation to verify uniqueness.

**Query Parameters**:
- `concurrent` (optional): Number of concurrent requests (default: 10)

**Example**:
```bash
curl "http://localhost:3000/api/ids/test-concurrency?concurrent=100"
```

**Response**:
```json
{
  "success": true,
  "total": 100,
  "unique": 100,
  "duplicates": 0,
  "ids": ["20251104-1", "20251104-2", ...],
  "timestamp": "2025-11-04T10:30:00.000Z"
}
```

## Testing

### Unit Tests

Run the unit tests:

```bash
pnpm test id.service.spec.ts
```

### Manual Testing with Redis

1. Start Redis locally:
```bash
docker run -d -p 6379:6379 redis:alpine
```

2. Set environment variable:
```bash
export REDIS_HOST=localhost
```

3. Start the server:
```bash
pnpm dev
```

4. Test endpoints:
```bash
# Health check
curl http://localhost:3000/api/health

# Generate single ID
curl http://localhost:3000/api/ids/next

# Test concurrency
curl "http://localhost:3000/api/ids/test-concurrency?concurrent=50"
```

## Architecture

### Module Structure

```
redis/
├── README.md              # This file
├── index.ts              # Public exports
├── redis.config.ts       # Configuration interface
├── redis.service.ts      # Redis connection management
├── redis.health.ts       # Health indicator
├── id.service.ts         # ID generation service
├── id.service.spec.ts    # Unit tests
└── redis.module.ts       # NestJS module definition
```

### Key Design Decisions

1. **Global Module**: RedisModule is marked as `@Global()` so it's available throughout the app without explicit imports.

2. **Connection Management**: 
   - Lazy connection with `lazyConnect: true`
   - Automatic reconnection with exponential backoff
   - Graceful shutdown on module destroy

3. **ID Strategy A (incr)**:
   - Uses daily-rotating keys (`uid:YYYYMMDD`)
   - Base36 encoding for compact IDs
   - 48-hour expiration to handle timezone edge cases
   - Atomic operations ensure uniqueness

4. **ID Strategy B (xadd)**:
   - Uses Redis Streams for native ID generation
   - MAXLEN ~ 1 to minimize storage
   - Precise millisecond timestamps

## Error Handling

The module handles errors gracefully:

- **Connection Errors**: Logged and automatic reconnection attempted
- **Generation Errors**: Logged and thrown to caller
- **Health Check**: Returns unhealthy status if Redis is down

Example error handling in your code:

```typescript
try {
  const id = await this.idService.nextId();
} catch (error) {
  this.logger.error(`Failed to generate ID: ${error.message}`);
  // Fallback logic or throw
}
```

## Performance Considerations

### Strategy A (incr) - Recommended
- **Operations per ID**: 1-2 (INCR + optional EXPIRE)
- **Network RTT**: 1 round trip
- **Throughput**: ~10,000-50,000 IDs/sec (single instance)
- **Storage**: Minimal (keys expire)

### Strategy B (xadd)
- **Operations per ID**: 1 (XADD)
- **Network RTT**: 1 round trip
- **Throughput**: ~5,000-20,000 IDs/sec
- **Storage**: Minimal (MAXLEN ~ 1)

Both strategies are suitable for high-concurrency environments and multi-instance deployments.

## Production Checklist

- [ ] Set `REDIS_URL` or Redis connection environment variables
- [ ] Enable TLS for production (`REDIS_TLS=true` or `rediss://` URL)
- [ ] Configure Redis authentication (password/username)
- [ ] Monitor health endpoint in your orchestrator
- [ ] Set up Redis clustering/replication for HA
- [ ] Configure appropriate Redis memory limits
- [ ] Monitor Redis metrics (ops/sec, memory usage)
- [ ] Test failover scenarios

## Troubleshooting

### Connection Issues

**Problem**: `Failed to connect to Redis: connect ECONNREFUSED`

**Solution**: 
- Verify Redis is running: `redis-cli ping`
- Check `REDIS_HOST` and `REDIS_PORT` environment variables
- Ensure Redis accepts connections from your network

### ID Generation Fails

**Problem**: `Failed to generate ID`

**Solution**:
- Check Redis health: `curl http://localhost:3000/api/health`
- Verify Redis connection in logs
- Check Redis memory limits: `redis-cli info memory`

### Health Check Returns Down

**Problem**: Health check shows Redis as down

**Solution**:
- Check Redis service status
- Verify network connectivity
- Review Redis logs for errors
- Test direct connection: `redis-cli -h <host> -p <port> ping`

## Migration Guide

If you have existing ID generation logic:

1. **Install and configure** the Redis module as described above
2. **Test in development** using the test endpoints
3. **Run concurrency tests** to ensure uniqueness
4. **Gradually migrate** by injecting `IdService` into existing services
5. **Monitor** ID generation metrics in production

Example migration:

```typescript
// Before
class MyService {
  generateId() {
    return `${Date.now()}-${Math.random()}`;  // Not guaranteed unique!
  }
}

// After
class MyService {
  constructor(private readonly idService: IdService) {}
  
  async generateId() {
    return await this.idService.nextId({ prefix: 'my:' });
  }
}
```

## Future Enhancements

Potential improvements:

- [ ] Add Prometheus metrics for ID generation rate
- [ ] Support for Snowflake-style IDs
- [ ] Bulk ID reservation for offline generation
- [ ] Redis Cluster support documentation
- [ ] ID format customization options
