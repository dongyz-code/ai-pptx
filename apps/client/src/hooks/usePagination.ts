/**
 * 通用分页封装
 *
 * 职责：
 * 1. 维护分页数据
 * 2. 提供分页相关计算
 * 3. 提供分页数据修改方法
 */
import { computed, shallowRef } from 'vue';

export type PaginationData = {
  /** 当前页 */
  current: number;

  /** 总数 */
  total: number;

  /** 每页显示条数 */
  pageSize: number;

  /** 每页显示条数下拉列表 */
  pageSizes: number[];
};

const defaultData: PaginationData = {
  current: 1,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
};

export function usePagination(_pageData: Partial<PaginationData>) {
  const pageData = shallowRef(Object.assign({ ...defaultData }, _pageData));

  const setPageData = (data: Partial<PaginationData>) => {
    pageData.value = Object.assign({}, defaultData, data);
  };

  const pageRange = computed(() => {
    const { current, pageSize } = pageData.value;
    return [(current - 1) * pageSize, current * pageSize];
  });

  return {
    pageData,
    pageRange,
    setPageData,
  };
}
