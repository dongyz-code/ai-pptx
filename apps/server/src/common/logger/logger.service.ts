import { Injectable, Inject, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ElasticsearchTransport, ElasticsearchTransportOptions } from './logger.transport.js';

/**
 * 日志级别
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

/**
 * 日志元数据
 */
export interface LogMetadata {
  context?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * 自定义 Logger 服务 - 封装 PinoLogger
 *
 * 功能特性：
 * - 自动区分开发/生产环境
 * - 开发环境：美化输出到控制台
 * - 生产环境：JSON 格式写入文件 + 控制台
 * - 支持日志文件轮转（每日，保留 30 天）
 * - 预留 Elasticsearch 写入接口
 */
@Injectable({ scope: Scope.TRANSIENT })
export class Logger {
  private context?: string;
  private esTransport?: ElasticsearchTransport;
  private readonly isDevelopment: boolean;

  constructor(@Inject(PinoLogger) private readonly pinoLogger: PinoLogger) {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * 设置日志上下文（通常是类名）
   */
  setContext(context: string) {
    this.context = context;
    this.pinoLogger.setContext(context);
  }

  /**
   * 配置 Elasticsearch 传输
   * 用于将日志发送到 ES
   */
  configureElasticsearch(options: ElasticsearchTransportOptions) {
    this.esTransport = new ElasticsearchTransport(options);
  }

  /**
   * 记录信息日志
   * 开发环境：美化输出
   * 生产环境：写入文件 + 控制台
   */
  log(message: string, ...args: any[]) {
    this.writeLog(LogLevel.INFO, message, ...args);
  }

  /**
   * 记录信息日志（别名）
   */
  info(message: string, ...args: any[]) {
    this.writeLog(LogLevel.INFO, message, ...args);
  }

  /**
   * 记录错误日志
   * 生产环境会额外写入 error.log
   */
  error(message: string, trace?: string, ...args: any[]) {
    if (trace) {
      this.writeLog(LogLevel.ERROR, message, { trace, ...this.parseArgs(args) });
    } else {
      this.writeLog(LogLevel.ERROR, message, ...args);
    }
  }

  /**
   * 记录警告日志
   */
  warn(message: string, ...args: any[]) {
    this.writeLog(LogLevel.WARN, message, ...args);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, ...args: any[]) {
    this.writeLog(LogLevel.DEBUG, message, ...args);
  }

  /**
   * 记录详细日志
   */
  verbose(message: string, ...args: any[]) {
    this.writeLog(LogLevel.VERBOSE, message, ...args);
  }

  /**
   * 写入日志的核心方法
   * 根据环境自动选择输出方式
   */
  private writeLog(level: LogLevel, message: string, ...args: any[]) {
    const metadata = this.buildMetadata(args);

    // 写入 Pino（自动处理文件写入和控制台输出）
    switch (level) {
      case LogLevel.ERROR:
        this.pinoLogger.error(metadata, message);
        break;
      case LogLevel.WARN:
        this.pinoLogger.warn(metadata, message);
        break;
      case LogLevel.INFO:
        this.pinoLogger.info(metadata, message);
        break;
      case LogLevel.DEBUG:
        this.pinoLogger.debug(metadata, message);
        break;
      case LogLevel.VERBOSE:
        this.pinoLogger.trace(metadata, message);
        break;
    }

    // 如果配置了 ES，异步写入（不阻塞主流程）
    if (this.esTransport && !this.isDevelopment) {
      this.writeToElasticsearch(level, message, metadata).catch((err) => {
        // ES 写入失败不影响主流程
        console.error('[Logger] Failed to write to Elasticsearch:', err.message);
      });
    }
  }

  /**
   * 写入 Elasticsearch
   */
  private async writeToElasticsearch(level: LogLevel, message: string, metadata: any): Promise<void> {
    if (!this.esTransport) return;

    const logEntry = {
      level,
      message,
      context: this.context,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    await this.esTransport.bulkWrite([logEntry]);
  }

  /**
   * 构建日志元数据
   */
  private buildMetadata(args: any[]): LogMetadata {
    const metadata: LogMetadata = {
      context: this.context,
      timestamp: new Date().toISOString(),
    };

    // 合并额外的参数
    const parsed = this.parseArgs(args);
    return { ...metadata, ...parsed };
  }

  /**
   * 解析日志参数
   */
  private parseArgs(args: any[]): any {
    if (args.length === 0) return {};
    if (args.length === 1 && typeof args[0] === 'object') return args[0];

    // 多个参数时，转换为对象
    return args.reduce((acc, arg, index) => {
      acc[`arg${index}`] = arg;
      return acc;
    }, {});
  }
}
