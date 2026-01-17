import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

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
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  type: PermissionType;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'parent_id' })
  parentId?: string;

  @ManyToOne(() => PermissionEntity, (permission) => permission.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: PermissionEntity;

  @OneToMany(() => PermissionEntity, (permission) => permission.parent)
  children?: PermissionEntity[];

  @Column({ type: 'varchar', length: 200, nullable: true })
  path?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string;

  @Column({ type: 'int', default: 0 })
  sort?: number;

  @Column({ type: 'varchar', length: 20, default: PermissionStatus.ACTIVE })
  status: PermissionStatus;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * 权限树节点（用于前端展示）
 */
export interface PermissionTreeNode extends PermissionEntity {
  children?: PermissionTreeNode[];
}
