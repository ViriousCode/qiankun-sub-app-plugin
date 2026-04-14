// sub-app/src/store/permission.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router';

const modules = import.meta.glob('../views/**/*.vue');

const lowerCaseModulesMap: Record<string, any> = {};
Object.keys(modules).forEach(key => {
  lowerCaseModulesMap[key.toLowerCase()] = modules[key];
});

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<any[]>([]);
  const isRoutesLoaded = ref(false);
  /** 与 qiankun 应用名、后端菜单 app 字段一致（脚手架会替换 {{APP_NAME}}） */
  const APP_NAME = '{{APP_NAME}}';
  const ACTIVE_RULE = '/{{APP_NAME}}';

  const extractMyMenus = (tree: any[]): any[] => {
    const res: any[] = [];
    tree.forEach(item => {
      const isMyApp = item.app === APP_NAME;
      const isMyPath = item.path && item.path.startsWith(ACTIVE_RULE);

      if (isMyApp || isMyPath) {
        const newItem = { ...item };
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = extractMyMenus(newItem.children);
        }
        res.push(newItem);
      } else if (item.children && item.children.length > 0) {
        const validChildren = extractMyMenus(item.children);
        if (validChildren.length > 0) {
          res.push({ ...item, children: validChildren });
        }
      }
    });
    return res;
  };

  const generateRoutes = (rawMenus: any[]) => {
    const myMenus = extractMyMenus(rawMenus);

    const getHiddenFlag = (item: any): boolean => {
      if (!item) return false;
      return Boolean(item.hidden ?? item?.meta?.hidden);
    };

    const processRoutesAll = (menuList: any[]) => {
      const result: any[] = [];
      menuList.forEach(item => {
        if (item.type === 'button') return;

        let innerPath = item.path || '';
        if (innerPath.startsWith(ACTIVE_RULE)) {
          innerPath = innerPath.replace(ACTIVE_RULE, '');
        }
        if (!innerPath.startsWith('/')) innerPath = '/' + innerPath;

        const hidden = getHiddenFlag(item);
        const routeObj: any = {
          path: innerPath,
          name: item.name || innerPath.replace(/^\//, '').replace(/\//g, '-'),
          meta: {
            ...(item.meta || {}),
            title: item?.meta?.title ?? item.title,
            icon: item?.meta?.icon ?? item.icon,
            hidden
          },
          children: []
        };

        if (item.children && item.children.length > 0) {
          routeObj.children = processRoutesAll(item.children);
        }

        if (innerPath && innerPath !== '/') {
          const safePath = innerPath.startsWith('/') ? innerPath : `/${innerPath}`;
          const indexPath = `../views${safePath}/index.vue`;
          const directPath = `../views${safePath}.vue`;

          const lowerIndexPath = indexPath.toLowerCase();
          const lowerDirectPath = directPath.toLowerCase();

          if (lowerCaseModulesMap[lowerIndexPath]) {
            routeObj.component = lowerCaseModulesMap[lowerIndexPath];
          } else if (lowerCaseModulesMap[lowerDirectPath]) {
            routeObj.component = lowerCaseModulesMap[lowerDirectPath];
          } else {
            console.error(`[permission] 映射失败，物理文件不存在: ${indexPath} 或 ${directPath}`);
          }
        }

        result.push(routeObj);
      });
      return result;
    };

    const routeTreeAll = processRoutesAll(myMenus);

    const filterVisibleMenus = (tree: any[]): any[] => {
      return tree
        .filter((n) => !n?.meta?.hidden)
        .map((n) => {
          const next = { ...n };
          if (next.children?.length) {
            next.children = filterVisibleMenus(next.children);
          }
          return next;
        });
    };

    menus.value = filterVisibleMenus(routeTreeAll);

    const flatRoutes: any[] = [];
    const generateFlatRoutes = (routeTree: any[]) => {
      routeTree.forEach(item => {
        if (item.children && item.children.length > 0) {
          generateFlatRoutes(item.children);
        }
        if (item.component) {
          flatRoutes.push({
            ...item,
            children: []
          });
        }
      });
    };
    generateFlatRoutes(routeTreeAll);

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
