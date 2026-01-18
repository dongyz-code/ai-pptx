import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RoleService } from './role.service.js';
import { CreateRoleDto, UpdateRoleDto, QueryRoleDto, RoleResponseDto, AssignPermissionsDto } from './dto/role.dto.js';
import { Permissions } from '@/common/decorators/permissions.decorator.js';
import { ApiResponseWrapper } from '@/common/decorators/api-response-wrapper.decorator.js';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponseWrapper(RoleResponseDto, { status: 201, description: '创建成功' })
  @Permissions('role:create')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '查询角色列表' })
  @ApiResponseWrapper(RoleResponseDto, { description: '查询成功', isArray: true })
  @Permissions('role:list')
  async findAll(@Query() query: QueryRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get('simple')
  @ApiOperation({ summary: '获取所有角色（不分页）' })
  @ApiResponseWrapper(RoleResponseDto, { description: '查询成功', isArray: true })
  async findAllSimple(): Promise<RoleResponseDto[]> {
    return this.roleService.findAllSimple();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponseWrapper(RoleResponseDto, { description: '查询成功' })
  @Permissions('role:read')
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponseWrapper(RoleResponseDto, { description: '更新成功' })
  @Permissions('role:update')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponseWrapper(null, { status: 204, description: '删除成功' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('role:delete')
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: '分配权限' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponseWrapper(RoleResponseDto, { description: '分配成功' })
  @Permissions('role:assign-permissions')
  async assignPermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto): Promise<RoleResponseDto> {
    return this.roleService.assignPermissions(id, dto);
  }
}
