// sub-app/src/store/permission.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router';
import { getMenuList } from '@/api/menu';
import { useUserStore } from './user';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const modules = import.meta.glob('../views/**/*.vue');

const lowerCaseModulesMap: Record<string, any> = {};
Object.keys(modules).forEach(key => {
  lowerCaseModulesMap[key.toLowerCase()] = modules[key];
});

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<any[]>([]);
  const isRoutesLoaded = ref(false);
  const APP_NAME = 'test';       // 对应后端菜单表里的 app 字段 (也是微应用的 name)
  const ACTIVE_RULE = '/{{APP_NAME}}';   // 对应微应用的 activeRule 路由前缀

  // 递归保留树形结构的菜单过滤算法
  const extractMyMenus = (tree: any[]): any[] => {
    const res: any[] = [];
    tree.forEach(item => {
      const isMyApp = item.app === APP_NAME;
      const isMyPath = item.path && item.path.startsWith(ACTIVE_RULE);

      if (isMyApp || isMyPath) {
        // 情况 A: 当前节点命中（属于本应用）
        // 克隆一份，并继续向下清洗它的子节点，防止掺杂脏数据
        const newItem = { ...item };
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = extractMyMenus(newItem.children);
        }
        res.push(newItem);
      } else if (item.children && item.children.length > 0) {
        // 情况 B: 当前节点没命中（比如它是个通用的父级"目录"）
        // 我们去它的子节点里挖一挖，如果挖到了属于本应用的子级，就把这个父级"外壳"保留下来
        const validChildren = extractMyMenus(item.children);
        if (validChildren.length > 0) {
          res.push({ ...item, children: validChildren });
        }
      }
    });
    return res;
  };

  const generateRoutes = (rawMenus: any[]) => {
    // 无论是否在乾坤内，都严格筛选属于自己的菜单
    const myMenus = extractMyMenus(rawMenus);

    const processRoutes = (menuList: any[]) => {
      const result: any[] = [];
      menuList.forEach(item => {
        if (item.type === 'button') return;

        let innerPath = item.path || '';
        if (innerPath.startsWith(ACTIVE_RULE)) {
          innerPath = innerPath.replace(ACTIVE_RULE, '');
        }
        if (!innerPath.startsWith('/')) innerPath = '/' + innerPath;

        const routeObj: any = {
          path: innerPath,
          name: item.name || innerPath.replace(/^\//, '').replace(/\//g, '-'),
          meta: item.meta || { title: item.title, icon: item.icon }, // 加上 title 和 icon 供侧边栏渲染
          children: []
        };

        if (item.children && item.children.length > 0) {
          routeObj.children = processRoutes(item.children);
        }

        if (innerPath && innerPath !== '/') {
          const safePath = innerPath.startsWith('/') ? innerPath : `/${innerPath}`;
          const indexPath = `../views${safePath}/index.vue`;
          const directPath = `../views${safePath}.vue`;

          const lowerIndexPath = indexPath.toLowerCase();
          const lowerDirectPath = directPath.toLowerCase();

          if (lowerCaseModulesMap[lowerIndexPath]) {
            routeObj.component = lowerCaseModulesMap[lowerIndexPath];
            console.log(`✅ 映射成功: ${safePath} => ${lowerIndexPath}`);
          } else if (lowerCaseModulesMap[lowerDirectPath]) {
            routeObj.component = lowerCaseModulesMap[lowerDirectPath];
            console.log(`✅ 映射成功: ${safePath} => ${lowerDirectPath}`);
          } else {
            console.error(`❌ 映射失败! 物理文件不存在: ${indexPath} 或 ${directPath}`);
          }
        }

        result.push(routeObj);
      });
      return result;
    };

    menus.value = processRoutes(myMenus);

    const flatRoutes: any[] = [];
    const generateFlatRoutes = (routeTree: any[]) => {
      routeTree.forEach(item => {
        if (item.children && item.children.length > 0) {
          generateFlatRoutes(item.children);
        }
        if (item.component) {
          flatRoutes.push(item);
        }
      });
    };
    generateFlatRoutes(menus.value);

    console.log('3. 最终成功挂载到 Router 的有效业务页面:', flatRoutes);

    flatRoutes.forEach(routeObj => {
      router.addRoute('LayoutRoot', routeObj);
    });

    const realBrowserPath = window.location.pathname;
    const isAtRoot = realBrowserPath === ACTIVE_RULE || realBrowserPath === `${ACTIVE_RULE}/`;

    if (isAtRoot && flatRoutes.length > 0) {
      router.replace(flatRoutes[0].path);
    }

    isRoutesLoaded.value = true;
  };

  const reset = () => {
    menus.value = [];
    isRoutesLoaded.value = false;
  };

  return { menus, isRoutesLoaded, generateRoutes, reset };
});