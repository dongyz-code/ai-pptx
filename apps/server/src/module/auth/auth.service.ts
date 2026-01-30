import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@/common/logger/logger.service.js';
import { UserService } from '../system/user/user.service.js';
import { RoleService } from '../system/role/role.service.js';
import { RedisService } from '../../common/redis/redis.service.js';
import { LoginDto, LoginResponseDto } from './dto/auth.dto.js';
import { UserStatus } from '../system/user/entities/user.entity.js';
import { randomBytes } from 'crypto';

/**
 * 认证服务 - 登录、登出、令牌管理
 */
@Injectable()
export class AuthService {
  // 令牌过期时间（秒）
  private readonly tokenExpiry = 7200; // 2小时

  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RoleService) private readonly roleService: RoleService,
    @Inject(RedisService) private readonly redisService: RedisService
  ) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto, ip?: string): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // 查找用户（包含角色关系）
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    if (!this.userService.verifyPassword(password, user.password)) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户状态
    if (user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException('用户已被禁用');
    }
    if (user.status === UserStatus.LOCKED) {
      throw new UnauthorizedException('用户已被锁定');
    }

    // 从用户的角色中提取角色ID列表
    const roleIds = user.roles?.map((r) => r.id) || [];

    // 获取用户权限
    const permissions = await this.roleService.getPermissionsByRoleIds(roleIds);

    // 生成令牌
    const accessToken = this.generateToken();

    // 用户信息（存储到Redis）
    const userInfo = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      roles: roleIds,
      permissions,
    };

    // 存储到Redis
    await this.redisService
      .getClient()
      .setex(`auth:token:${accessToken}`, this.tokenExpiry, JSON.stringify(userInfo));

    // 更新最后登录信息
    await this.userService.updateLastLogin(user.id, ip || '');

    this.logger.info(`用户 ${username} 登录成功`);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenExpiry,
      user: userInfo,
    };
  }

  /**
   * 用户登出
   */
  async logout(token: string): Promise<void> {
    if (!token) {
      return;
    }

    // 从Redis删除令牌
    await this.redisService.getClient().del(`auth:token:${token}`);
    this.logger.info('用户登出成功');
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: string): Promise<any> {
    const user = await this.userService.findOne(userId);
    const permissions = await this.userService.getUserPermissions(userId);

    return {
      ...user,
      permissions,
    };
  }

  /**
   * 验证令牌
   */
  async validateToken(token: string): Promise<any> {
    const userJson = await this.redisService.getClient().get(`auth:token:${token}`);
    if (!userJson) {
      return null;
    }
    return JSON.parse(userJson);
  }

  /**
   * 刷新令牌
   */
  async refreshToken(oldToken: string): Promise<LoginResponseDto> {
    const user = await this.validateToken(oldToken);
    if (!user) {
      throw new UnauthorizedException('令牌已过期');
    }

    // 删除旧令牌
    await this.redisService.getClient().del(`auth:token:${oldToken}`);

    // 生成新令牌
    const newToken = this.generateToken();
    await this.redisService
      .getClient()
      .setex(`auth:token:${newToken}`, this.tokenExpiry, JSON.stringify(user));

    return {
      accessToken: newToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenExpiry,
      user,
    };
  }

  /**
   * 生成随机令牌
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }
}
