// sub-app/src/router/permission.ts
import router from '@/router';
import { usePermissionStore } from '@/store/permission';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
// import { getMenuList } from '@/api/menu';
import { watch } from 'vue';

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  // 结合 dom 属性判断，确保万无一失
  const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__ || document.querySelector('[data-qiankun="{{APP_NAME}}"]');

  // 情况 1: 路由还没加载好
  if (!permissionStore.isRoutesLoaded) {
    if (isQiankun) {
      // 乾坤模式：挂起等待
      const unwatch = watch(
        () => permissionStore.isRoutesLoaded,
        (loaded) => {
          if (loaded) {
            unwatch();
            // 🚨 路由加载完毕后，立刻尝试去 resolve 一下目标路径
            const { matched } = router.resolve(to.path);
            // 如果能匹配到非 404 的页面，就跳转过去；否则直接去 404
            if (matched.length > 0 && matched[matched.length - 1]?.name !== 'NotFound') {
               next({ path: to.path, query: to.query, hash: to.hash, replace: true });
            } else {
               next(); // 放行，自然会掉进 404
            }
          }
        },
        { immediate: true }
      );
    } else {
      // 独立运行模式
      try {
        // const rawMenus = await getMenuList();
        // permissionStore.generateRoutes(rawMenus || []);
        // next({ ...to, replace: true });
      } catch (error) {
        next();
      }
    }
  } 
  // 情况 2: 路由已经加载好了
  else {
    // 只有当路由解析结果真的是 'NotFound' 时，才需要介入检查
    if (to.name === 'NotFound') {
      // 拿着这个路径，去最新的路由表里“问”一下：你真的不存在吗？
      const { matched } = router.resolve(to.path);
      
      // 如果最新路由表里其实找得到这个页面（name 不等于 NotFound），说明刚才那个 to 是过期的误判
      if (matched.length > 0 && matched[matched.length - 1]?.name !== 'NotFound') {
        console.log(`[子应用] 404 误判修复，重定向到正确页面: ${to.path}`);
        next({ path: to.path, query: to.query, hash: to.hash, replace: true });
      } else {
        // 如果最新路由表里也找不到，那就是真的 404 了，放行！
        console.log(`[子应用] 确认为无效路径，显示 404: ${to.path}`);
        next(); 
      }
    } else {
      // 正常页面，直接放行
      next();
    }
  }
});