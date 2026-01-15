import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: '用户ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiPropertyOptional({ description: '昵称' })
  nickname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiPropertyOptional({ description: '手机号' })
  phone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: '头像URL' })
  avatar?: string;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  @ApiProperty({ description: '用户状态', enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiPropertyOptional({ description: '备注' })
  remark?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  @ApiPropertyOptional({ description: '最后登录时间' })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_login_ip' })
  @ApiPropertyOptional({ description: '最后登录IP' })
  lastLoginIp?: string;

  @ManyToMany(() => RoleEntity, { eager: false })
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
