// sub-app/src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 清除监听器的方法
import { initAuthListener, clearAuthListener } from '@/utils/auth-listener';
// 引入指令
import { vPermission } from '@/directives/permission';
import { vDebounce } from '@/directives/debounce';

import '@/router/permission'

let app: any;

async function render(props: any = {}) {
  const { container } = props;
  app = createApp(App);

  // 1. 注册插件
  const pinia = createPinia();
  app.use(pinia);

  // 🚨 【开发便利】：如果是独立运行，在 router 挂载前注入 Mock Token
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    const { useUserStore } = await import('@/store/user'); // 动态引入避免报错
    const userStore = useUserStore();
    // 强制给个 Token 骗过路由守卫，方便独立调试业务页面
    if (!userStore.token) {
      userStore.token = 'mock-dev-token-123';
    }
  }

  app.use(router);

  // 2. 注册指令
  app.directive('permission', vPermission);
  app.directive('debounce', vDebounce);

  // 3. 初始化鉴权及数据监听
  initAuthListener(props, router);

  // 4. 挂载应用
  app.mount(container ? container.querySelector('#{{APP_NAME}}') : '#{{APP_NAME}}');
}

renderWithQiankun({
  mount(props) {
    console.log('[子应用] Mount');
    render(props);
  },
  bootstrap() {
    console.log('[子应用] Bootstrap');
  },
  unmount(props: any) {
    console.log('[子应用] Unmount');
    if (app) {
      app.unmount();
      app = null;
    }
    // 在子应用卸载时，主动停止所有的外部监听和 watch，防止内存泄漏和幽灵篡改 URL！
    clearAuthListener(props);
  },
  update(props: any) {
    console.log('[子应用] Update');
  },
});

// 独立运行时的渲染逻辑
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}