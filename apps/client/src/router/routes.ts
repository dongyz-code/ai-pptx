import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
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
    ],
  },
];
