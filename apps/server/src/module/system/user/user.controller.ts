import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { CreateUserDto, UpdateUserDto, QueryUserDto, UserResponseDto, ChangePasswordDto } from './dto/user.dto.js';
import { Permissions } from '@/common/decorators/permissions.decorator.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import { ApiResponseWrapper } from '@/common/decorators/api-response-wrapper.decorator.js';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponseWrapper(UserResponseDto, { status: 201, description: '创建成功' })
  @Permissions('user:create')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResponseWrapper(UserResponseDto, { description: '查询成功', isArray: true })
  @Permissions('user:list')
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponseWrapper(UserResponseDto, { description: '查询成功' })
  @Permissions('user:read')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponseWrapper(UserResponseDto, { description: '更新成功' })
  @Permissions('user:update')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponseWrapper(null, { status: 204, description: '删除成功' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('user:delete')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: '修改密码' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponseWrapper(null, { description: '修改成功' })
  async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(id, dto);
  }

  @Get('me/profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponseWrapper(UserResponseDto, { description: '查询成功' })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    return this.userService.findOne(userId);
  }
}
