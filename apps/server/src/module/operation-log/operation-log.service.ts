import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThan, Between, In } from 'typeorm';
import { OperationLogEntity } from './entities/operation-log.entity.js';
import { QueryOperationLogDto, DeleteOperationLogsDto } from './dto/operation-log.dto.js';
import { PaginatedResponse } from '../../common/dto/response.dto.js';
import { IdService } from '../../common/id/id.service.js';

/**
 * 操作日志服务 - 日志记录和查询
 */
@Injectable()
export class OperationLogService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @InjectRepository(OperationLogEntity)
    private readonly logRepository: Repository<OperationLogEntity>,
    private readonly idService: IdService
  ) {
    this.logger.setContext(OperationLogService.name);
  }

  /**
   * 创建操作日志
   */
  async create(log: Omit<OperationLogEntity, 'id' | 'createdAt'>): Promise<OperationLogEntity> {
    const id = await this.idService.nextId({ prefix: 'log-' });

    const logEntry = this.logRepository.create({
      id,
      ...log,
    });

    return this.logRepository.save(logEntry);
  }

  /**
   * 查询操作日志列表（分页）
   */
  async findAll(query: QueryOperationLogDto) {
    const {
      page = 1,
      pageSize = 10,
      username,
      module,
      action,
      url,
      statusCode,
      startTime,
      endTime,
    } = query;

    const where: any = {};
    if (username) where.username = Like(`%${username}%`);
    if (module) where.module = module;
    if (action) where.action = action;
    if (url) where.url = Like(`%${url}%`);
    if (statusCode !== undefined) where.statusCode = statusCode;

    if (startTime && endTime) {
      where.createdAt = Between(new Date(startTime), new Date(endTime));
    } else if (startTime) {
      where.createdAt = Between(new Date(startTime), new Date());
    } else if (endTime) {
      where.createdAt = LessThan(new Date(endTime));
    }

    const [logs, total] = await this.logRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return new PaginatedResponse(logs, total, page, pageSize);
  }

  /**
   * 根据ID查询操作日志
   */
  async findOne(id: string): Promise<OperationLogEntity> {
    const log = await this.logRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException('日志不存在');
    }
    return log;
  }

  /**
   * 批量删除操作日志
   */
  async remove(dto: DeleteOperationLogsDto): Promise<{ deleted: number }> {
    let result: any;

    if (dto.ids && dto.ids.length > 0) {
      result = await this.logRepository.delete({ id: In(dto.ids) });
    } else if (dto.beforeTime) {
      result = await this.logRepository.delete({
        createdAt: LessThan(new Date(dto.beforeTime)),
      });
    }

    const deleted = result?.affected || 0;
    this.logger.info(`删除了 ${deleted} 条操作日志`);
    return { deleted };
  }

  /**
   * 清空所有日志
   */
  async clear(): Promise<{ deleted: number }> {
    const result = await this.logRepository.clear();
    this.logger.info('清空了所有操作日志');
    return { deleted: 0 }; // clear() 不返回删除数量
  }
}
