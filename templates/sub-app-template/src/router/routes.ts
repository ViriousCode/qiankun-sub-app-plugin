import type { RouteRecordRaw } from 'vue-router';

// 静态路由：定义好父节点 LayoutRoot
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LayoutRoot', // 必须叫这个名字，addRoute 要用
    component: () => import('@/layout/index.vue'), // 子应用的布局组件
    redirect: '/test/list',
    children: [] // 初始为空
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    // ✅ 必须直接渲染组件，不要做任何 redirect 重定向
    component: () => import('@/views/error/404.vue'), 
    meta: { hidden: true }
  }
];
