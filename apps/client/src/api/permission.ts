import { request } from '@/plugins';
import type {
  PermissionEntity,
  CreatePermissionDto,
  PageDto,
  PageResponseDto,
} from '@pkg/types';

export const permissionApi = {
  getList(params: PageDto): Promise<PageResponseDto<PermissionEntity>> {
    return request.get<PageResponseDto<PermissionEntity>>('/permissions', { params });
  },

  getById(id: string): Promise<PermissionEntity> {
    return request.get<PermissionEntity>(`/permissions/${id}`);
  },

  create(data: CreatePermissionDto): Promise<PermissionEntity> {
    return request.post<PermissionEntity>('/permissions', data);
  },

  update(id: string, data: CreatePermissionDto): Promise<PermissionEntity> {
    return request.put<PermissionEntity>(`/permissions/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return request.delete<void>(`/permissions/${id}`);
  },
};
