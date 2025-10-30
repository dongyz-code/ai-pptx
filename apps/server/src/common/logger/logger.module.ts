import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { getLoggerConfig } from './logger.config.js';

@Module({
  imports: [PinoLoggerModule.forRoot(getLoggerConfig())],
  exports: [PinoLoggerModule],
})
export class AppLoggerModule {}
