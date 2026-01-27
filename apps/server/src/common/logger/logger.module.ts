import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { getLoggerConfig } from './logger.config.js';
import { Logger } from './logger.service.js';

@Global()
@Module({
  imports: [PinoLoggerModule.forRoot(getLoggerConfig())],
  providers: [Logger],
  exports: [PinoLoggerModule, Logger],
})
export class AppLoggerModule {}
