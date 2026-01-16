import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PermissionService } from './permission.service.js';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  QueryPermissionDto,
  PermissionResponseDto,
  PermissionTreeResponseDto,
} from './dto/permission.dto.js';
import { PaginatedResponse } from '@/common/dto/response.dto.js';
import { Permissions } from '@/common/decorators/permissions.decorator.js';

@ApiTags('权限管理')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '创建成功', type: PermissionResponseDto })
  @Permissions('permission:create')
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: '查询权限列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('permission:list')
  async findAll(@Query() query: QueryPermissionDto): Promise<PaginatedResponse<PermissionResponseDto>> {
    return this.permissionService.findAll(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getTree(): Promise<PermissionTreeResponseDto[]> {
    return this.permissionService.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询权限' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 200, description: '查询成功', type: PermissionResponseDto })
  @Permissions('permission:read')
  async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 200, description: '更新成功', type: PermissionResponseDto })
  @Permissions('permission:update')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ): Promise<PermissionResponseDto> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('permission:delete')
  async remove(@Param('id') id: string): Promise<void> {
    return this.permissionService.remove(id);
  }
}
