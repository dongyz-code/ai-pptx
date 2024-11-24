import { NavigationGuardWithThis } from 'vue-router';

export const withPermission: NavigationGuardWithThis<unknown> = async (to, from, next) => {
  if (!to.meta.isAuth) {
    return next();
  }

  next();
};
