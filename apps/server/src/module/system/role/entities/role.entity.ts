import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PermissionEntity } from '../../permission/entities/permission.entity.js';

/**
 * 角色状态枚举
 */
export enum RoleStatus {
  /** 正常 */
  ACTIVE = 'active',
  /** 禁用 */
  DISABLED = 'disabled',
}

/**
 * 角色实体
 */
@Entity('sys_role')
export class RoleEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, default: RoleStatus.ACTIVE })
  status: RoleStatus;

  @Column({ type: 'int', default: 0 })
  sort?: number;

  @ManyToMany(() => PermissionEntity, { eager: false })
  @JoinTable({
    name: 'sys_role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions?: PermissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
