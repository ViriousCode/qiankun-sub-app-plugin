// sub-app/src/router/permission.ts
import router from '@/router';
import { usePermissionStore } from '@/store/permission';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { getMenuList } from '@/api/menu';
import { watch } from 'vue';
import { useUserStore } from '@/store/user';

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__ || document.querySelector('[data-qiankun="{{APP_NAME}}"]');

  if (!permissionStore.isRoutesLoaded) {
    if (isQiankun) {
      const unwatch = watch(
        () => permissionStore.isRoutesLoaded,
        (loaded) => {
          if (loaded) {
            unwatch();
            const { matched } = router.resolve(to.path);
            if (matched.length > 0 && matched[matched.length - 1]?.name !== 'NotFound') {
              next({ path: to.path, query: to.query, hash: to.hash, replace: true });
            } else {
              next();
            }
          }
        },
        { immediate: true }
      );
    } else {
      const userStore = useUserStore();

      if (!userStore.token) {
        if (to.path === '/login') {
          next();
        } else {
          next('/login');
        }
        return;
      }
      try {
        const rawMenus = await getMenuList();
        permissionStore.generateRoutes(rawMenus || []);
        next({ ...to, replace: true });
      } catch (error) {
        console.error('[子应用] 独立运行获取菜单失败', error);
        permissionStore.generateRoutes([]);
        next({ ...to, replace: true });
      }
    }
  } else {
    if (to.name === 'NotFound') {
      const { matched } = router.resolve(to.path);

      if (matched.length > 0 && matched[matched.length - 1]?.name !== 'NotFound') {
        console.log(`[子应用] 404 误判修复，重定向到正确页面: ${to.path}`);
        next({ path: to.path, query: to.query, hash: to.hash, replace: true });
      } else {
        console.log(`[子应用] 确认为无效路径，显示 404: ${to.path}`);
        next();
      }
    } else {
      next();
    }
  }
});
