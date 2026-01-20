import { request } from '@/plugins';
import type {
  UserListItem,
  CreateUserDto,
  PageDto,
  PageResponseDto,
} from '@pkg/types';

export const userApi = {
  getList(params: PageDto): Promise<PageResponseDto<UserListItem>> {
    return request.get<PageResponseDto<UserListItem>>('/users', { params });
  },

  getById(id: string): Promise<UserListItem> {
    return request.get<UserListItem>(`/users/${id}`);
  },

  create(data: CreateUserDto): Promise<UserListItem> {
    return request.post<UserListItem>('/users', data);
  },

  update(id: string, data: CreateUserDto): Promise<UserListItem> {
    return request.put<UserListItem>(`/users/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return request.delete<void>(`/users/${id}`);
  },
};
