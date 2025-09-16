/**
 * 通用表格Hook
 *
 * 职责：
 * 1. 数据获取与状态管理
 * 2. 分页、排序、筛选控制
 */
import { ref } from 'vue';
import { usePagination } from './usePagination';

export type TableParams<T> = {
  /** 表格行key */
  rowKey: string;

  /** 未传request时的表格数据 */
  dataSource: T[];

  /** 获取表格数据的方法， */
  request: (page: { current: number; pageSize: number }) => Promise<T[]>;

  /** params */
};

export function usePageRequest<T>(config: TableParams<T>) {}
