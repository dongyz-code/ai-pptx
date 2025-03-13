import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports, type LoggerOptions } from 'winston';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { LOG_DIR } from '@/common/env/static.js';
import 'winston-daily-rotate-file';

class MLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(application: string) {
    const _transports: LoggerOptions['transports'] = [
      new transports.DailyRotateFile({
        format: format.combine(format.timestamp(), format.json()),
        dirname: LOG_DIR,
        filename: `%DATE%-${application.toLocaleLowerCase()}.log`,
        maxSize: '1g',
      }),
    ];

    if (process.env.NODE_ENV === 'development') {
      _transports.push(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const app = chalk.green(`[${application}]`);
              const contextStr = context ? chalk.yellow(`[${context}]`) : '';
              return `${app} ${time} ${level} ${contextStr} ${message} `;
            })
          ),
        })
      );
    } else {
      _transports.push(
        new transports.Console({
          format: format.combine(format.timestamp(), format.timestamp()),
        })
      );
    }

    this.logger = createLogger({
      level: 'info',
      transports: _transports,
    });
  }

  private getTime() {
    return dayjs().format('YYYY/MM/DD HH:mm:ss');
  }

  log(message: string, context?: string) {
    this.logger.log('info', message, { context, time: this.getTime() });
  }

  info(message: string, context?: string) {
    this.logger.log('info', message, { context, time: this.getTime() });
  }

  error(message: string, context?: string) {
    this.logger.log('error', message, { context, time: this.getTime() });
  }

  warn(message: string, context?: string) {
    this.logger.log('warn', message, { context, time: this.getTime() });
  }

  debug(message: string, context?: string) {
    this.logger.log('debug', message, { context });
  }
}

const logger = new MLogger('System');
const nestLogger = new MLogger('Nest');

export { logger, nestLogger };
