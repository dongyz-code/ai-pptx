import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: '角色ID' })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: '角色名称' })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '角色编码' })
  code: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @ApiPropertyOptional({ description: '角色描述' })
  description?: string;

  @Column({ type: 'varchar', length: 20, default: RoleStatus.ACTIVE })
  @ApiProperty({ description: '角色状态', enum: RoleStatus })
  status: RoleStatus;

  @Column({ type: 'int', default: 0 })
  @ApiPropertyOptional({ description: '排序号' })
  sort?: number;

  @ManyToMany(() => PermissionEntity, { eager: false })
  @JoinTable({
    name: 'sys_role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions?: PermissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
