import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 操作日志实体
 */
@Entity('sys_operation_log')
@Index('idx_log_created_at', ['createdAt'])
@Index('idx_log_user_id', ['userId'])
export class OperationLogEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'user_id' })
  userId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ip?: string;

  @Column({ type: 'jsonb', nullable: true })
  params?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  body?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'int', name: 'status_code' })
  statusCode: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'user_agent' })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
