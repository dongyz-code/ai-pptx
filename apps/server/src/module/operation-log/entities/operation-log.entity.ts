import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 操作日志实体
 */
@Entity('sys_operation_log')
@Index('idx_log_created_at', ['createdAt'])
@Index('idx_log_user_id', ['userId'])
export class OperationLogEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '日志ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'user_id' })
  @ApiPropertyOptional({ description: '用户ID' })
  userId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ description: '用户名' })
  username?: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '模块名称' })
  module: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '操作名称' })
  action: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ description: 'HTTP方法' })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  @ApiProperty({ description: '请求URL' })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ description: '请求IP' })
  ip?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiPropertyOptional({ description: '请求参数' })
  params?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiPropertyOptional({ description: '请求体' })
  body?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiPropertyOptional({ description: '响应结果' })
  result?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: '错误信息' })
  error?: string;

  @Column({ type: 'int', name: 'status_code' })
  @ApiProperty({ description: '状态码' })
  statusCode: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: '耗时（毫秒）' })
  duration: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'user_agent' })
  @ApiPropertyOptional({ description: 'User-Agent' })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
