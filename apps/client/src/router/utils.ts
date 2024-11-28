import type { RouteRecordRaw } from 'vue-router';
import type { RouteName } from './static';

export type RouteItem = Omit<RouteRecordRaw, 'name'> & {
  name: RouteName;
};

export function getRoute(routes: RouteItem[]) {
  return routes as RouteRecordRaw[];
}
