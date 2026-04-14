import { createRouter, createWebHistory } from 'vue-router';
import { constantRoutes } from './routes';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

/** 乾坤内与 activeRule 一致；独立开发与 vite base（如 /{{APP_NAME}}/）一致；生产 base 为 ./ 时用站点根 */
function resolveHistoryBase(): string {
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    return '/{{APP_NAME}}';
  }
  const b = import.meta.env.BASE_URL;
  if (b === './' || b === '.') {
    return '/';
  }
  return b;
}

const router = createRouter({
  history: createWebHistory(resolveHistoryBase()),
  routes: constantRoutes
});

export default router;
