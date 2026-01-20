import { NavigationGuardWithThis } from 'vue-router';
import { useUserStore } from '@/models/user';

export const withPermission: NavigationGuardWithThis<unknown> = async (to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.isAuth === false) {
    return next();
  }

  if (!userStore.isLoggedIn) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  const requiredPermission = to.meta.permission as string | undefined;
  if (requiredPermission && !userStore.userInfo?.permissions.includes(requiredPermission)) {
    return next({ path: '/403' });
  }

  next();
};
