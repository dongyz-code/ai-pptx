import { RouteItem, getRoute } from './utils';

const _routes: RouteItem[] = [
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
    ],
  },
];

export const routes = getRoute(_routes);
