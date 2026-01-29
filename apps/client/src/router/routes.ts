import { RouteItem, getRoute } from './utils';

const _routes: RouteItem[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      isAuth: false,
    },
  },
  {
    path: '/',
    name: 'BasicLayout',
    component: () => import('@/layout/basic-layout.tsx'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/index.tsx'),
        meta: {
          isAuth: false,
        },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/pages/ppt-editor'),
      },
      {
        path: 'system/users',
        name: 'UserManagement',
        component: () => import('@/pages/system/users/index.vue'),
        meta: {
          permission: 'system:user:view',
        },
      },
      {
        path: 'system/roles',
        name: 'RoleManagement',
        component: () => import('@/pages/system/roles/index.vue'),
        meta: {
          permission: 'system:role:view',
        },
      },
      {
        path: 'system/permissions',
        name: 'PermissionManagement',
        component: () => import('@/pages/system/permissions/index.vue'),
        meta: {
          permission: 'system:permission:view',
        },
      },
    ],
  },
];

export const routes = getRoute(_routes);
