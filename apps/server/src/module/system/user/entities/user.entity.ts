import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity.js';

/**
 * 用户状态枚举
 */
export enum UserStatus {
  /** 正常 */
  ACTIVE = 'active',
  /** 禁用 */
  DISABLED = 'disabled',
  /** 锁定 */
  LOCKED = 'locked',
}

/**
 * 用户实体
 */
@Entity('sys_user')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_login_ip' })
  lastLoginIp?: string;

  @ManyToMany(() => RoleEntity, { eager: false })
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
