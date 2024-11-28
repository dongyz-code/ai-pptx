import { router } from '@/router';
import type { RouteName } from '@/router/static';

export const routerPush = (to: {
  name: RouteName;
  params?: Record<string, string>;
  query?: Record<string, string>;
  replace?: boolean;
}) => {
  return router.push(to);
};
