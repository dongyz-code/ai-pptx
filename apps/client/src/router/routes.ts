import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: '',
    component: () => import('@/layout/BasicLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: {
          isAuth: true,
        },
      },
      { path: 'about', name: 'About', component: () => import('@/pages/about/index.vue') },
    ],
  },
];
