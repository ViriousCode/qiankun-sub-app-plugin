import type { RouteRecordRaw } from 'vue-router';

// 静态路由：仅壳子 + 404；业务路由由菜单接口动态 addRoute
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LayoutRoot',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: []
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true }
  }
];
