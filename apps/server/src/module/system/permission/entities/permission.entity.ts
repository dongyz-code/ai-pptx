import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 权限类型枚举
 */
export enum PermissionType {
  /** 目录 */
  DIRECTORY = 'directory',
  /** 菜单 */
  MENU = 'menu',
  /** 按钮/操作 */
  BUTTON = 'button',
  /** API接口 */
  API = 'api',
}

/**
 * 权限状态枚举
 */
export enum PermissionStatus {
  /** 正常 */
  ACTIVE = 'active',
  /** 禁用 */
  DISABLED = 'disabled',
}

/**
 * 权限实体
 */
@Entity('sys_permission')
export class PermissionEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '权限ID' })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '权限名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({ description: '权限编码' })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({ description: '权限类型', enum: PermissionType })
  type: PermissionType;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'parent_id' })
  @ApiPropertyOptional({ description: '父级权限ID' })
  parentId?: string;

  @ManyToOne(() => PermissionEntity, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: PermissionEntity;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @ApiPropertyOptional({ description: '路由路径' })
  path?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ description: '图标' })
  icon?: string;

  @Column({ type: 'int', default: 0 })
  @ApiPropertyOptional({ description: '排序号' })
  sort?: number;

  @Column({ type: 'varchar', length: 20, default: PermissionStatus.ACTIVE })
  @ApiProperty({ description: '权限状态', enum: PermissionStatus })
  status: PermissionStatus;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @ApiPropertyOptional({ description: '描述' })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}

/**
 * 权限树节点（用于前端展示）
 */
export interface PermissionTreeNode extends PermissionEntity {
  children?: PermissionTreeNode[];
}
