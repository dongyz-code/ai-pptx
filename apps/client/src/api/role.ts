import { request } from '@/plugins';
import type { RoleEntity, CreateRoleDto, PageDto, PageResponseDto } from '@pkg/types';

export const roleApi = {
  getList(params: PageDto): Promise<PageResponseDto<RoleEntity>> {
    return request.get<PageResponseDto<RoleEntity>>('/roles', { params });
  },

  getById(id: string): Promise<RoleEntity> {
    return request.get<RoleEntity>(`/roles/${id}`);
  },

  create(data: CreateRoleDto): Promise<RoleEntity> {
    return request.post<RoleEntity>('/roles', data);
  },

  update(id: string, data: CreateRoleDto): Promise<RoleEntity> {
    return request.put<RoleEntity>(`/roles/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return request.delete<void>(`/roles/${id}`);
  },
};
