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
 * 登录请求参数
 */
export interface LoginDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

/**
 * 登录用户信息
 */
export interface LoginUserInfo {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 角色列表 */
  roles: string[];
  /** 权限列表 */
  permissions: string[];
}

/**
 * 登录响应数据
 */
export interface LoginResponseDto {
  /** 访问令牌 */
  accessToken: string;
  /** 令牌类型 */
  tokenType: string;
  /** 过期时间（秒） */
  expiresIn: number;
  /** 用户信息 */
  user?: LoginUserInfo;
}

/**
 * 用户详细信息
 */
export interface UserEntity {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 邮箱 */
  email?: string;
  /** 手机号 */
  phone?: string;
  /** 头像 */
  avatar?: string;
  /** 状态 */
  status: UserStatus;
  /** 备注 */
  remark?: string;
  /** 最后登录时间 */
  lastLoginAt?: Date;
  /** 最后登录IP */
  lastLoginIp?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 刷新令牌请求
 */
export interface RefreshTokenDto {
  /** 刷新令牌 */
  refreshToken: string;
}
