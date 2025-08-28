import type { RouteRecordRaw } from 'vue-router';
import type { RouteName } from './static';

export type RouteItem = Omit<RouteRecordRaw, 'name'> & {
  name: RouteName;
};

export function getRoute(routes: RouteItem[]) {
  /** 暂无其他定制，直接返回 */
  return routes as RouteRecordRaw[];
}
