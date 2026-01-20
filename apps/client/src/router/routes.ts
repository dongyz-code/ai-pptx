import { RouteItem, getRoute } from './utils';

const _routes: RouteItem[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login/index.vue'),
    meta: {
      isAuth: false,
    },
  },
  {
    path: '/',
    name: 'BasicLayout',
    component: () => import('@/layout/BasicLayout.tsx'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/Home/index.tsx'),
        meta: {
          isAuth: false,
        },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/pages/Editor/index.tsx'),
      },
      {
        path: 'system/users',
        name: 'UserManagement',
        component: () => import('@/pages/System/UserManagement.vue'),
        meta: {
          permission: 'system:user:view',
        },
      },
      {
        path: 'system/roles',
        name: 'RoleManagement',
        component: () => import('@/pages/System/RoleManagement.vue'),
        meta: {
          permission: 'system:role:view',
        },
      },
      {
        path: 'system/permissions',
        name: 'PermissionManagement',
        component: () => import('@/pages/System/PermissionManagement.vue'),
        meta: {
          permission: 'system:permission:view',
        },
      },
    ],
  },
];

export const routes = getRoute(_routes);
