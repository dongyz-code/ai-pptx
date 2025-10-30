import path from 'path';
import { Params } from 'nestjs-pino';
import pino from 'pino';
import { createStream } from 'rotating-file-stream';

const __dirname = import.meta.dirname;

export function getLoggerConfig(): Params {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const logLevel = process.env.LOG_LEVEL ?? 'info';
  const logDir = path.join(__dirname, '../../../logs');

  const baseConfig: Params = {
    pinoHttp: {
      level: logLevel,
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/api/health',
      },
      customProps: () => ({
        context: 'HTTP',
      }),
      serializers: {
        req: (req) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          remoteAddress: req.ip,
          remotePort: req.socket?.remotePort,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    },
  };

  if (isDevelopment) {
    baseConfig.pinoHttp = {
      ...baseConfig.pinoHttp,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: false,
          ignore: 'pid,hostname',
          messageFormat: '{context} {msg}',
        },
      },
    };
  } else {
    const appLogStream = createStream('app.log', {
      interval: '1d',
      maxFiles: 30,
      path: logDir,
      compress: 'gzip',
    });

    const errorLogStream = createStream('error.log', {
      interval: '1d',
      maxFiles: 30,
      path: logDir,
      compress: 'gzip',
    });

    const streams: pino.StreamEntry[] = [
      {
        level: logLevel as pino.Level,
        stream: appLogStream,
      },
      {
        level: 'error' as pino.Level,
        stream: errorLogStream,
      },
      {
        level: logLevel as pino.Level,
        stream: process.stdout,
      },
    ];

    baseConfig.pinoHttp = {
      ...baseConfig.pinoHttp,
      stream: pino.multistream(streams),
    };
  }

  return baseConfig;
}
