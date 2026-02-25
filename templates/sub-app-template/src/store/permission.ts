// sub-app/src/store/permission.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'; // 引入乾坤环境变量

const modules = import.meta.glob('../views/**/*.vue');

// 🚨 【核心修复 1】：建立无视大小写的 Vue 文件映射表！
// 彻底解决路径是小写，但本地文件夹大写导致的映射失败问题
const lowerCaseModulesMap: Record<string, any> = {};
Object.keys(modules).forEach(key => {
  lowerCaseModulesMap[key.toLowerCase()] = modules[key];
});

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<any[]>([]);
  const isRoutesLoaded = ref(false);
  const subAppPrefix = '/{{APP_NAME}}';

  // 【核心修复 2】：双保险提取子应用菜单 (判断 app标识 或者 路径前缀)
  const extractMyMenus = (tree: any[]): any[] => {
    const res: any[] = [];
    tree.forEach(item => {
      const isMyApp = item.app === '{{APP_NAME}}';
      const isMyPath = item.path && item.path.startsWith(subAppPrefix);

      // 只要满足其一，就认定是属于本子应用的菜单
      if (isMyApp || isMyPath) {
        res.push(item);
      } else if (item.children && item.children.length > 0) {
        res.push(...extractMyMenus(item.children));
      }
    });
    return res;
  };

  const generateRoutes = (rawMenus: any[]) => {
    let myMenus = extractMyMenus(rawMenus);
    // 只有在独立运行时 (没被乾坤包裹)，没匹配到才全量渲染
    if (myMenus.length === 0 && !qiankunWindow.__POWERED_BY_QIANKUN__) {
      myMenus = rawMenus;
    }

    const processRoutes = (menuList: any[]) => {
      const result: any[] = [];
      menuList.forEach(item => {
        if (item.type === 'button') return;

        let innerPath = item.path || '';
        if (innerPath.startsWith(subAppPrefix)) {
          innerPath = innerPath.replace(subAppPrefix, '');
        }
        if (!innerPath.startsWith('/')) innerPath = '/' + innerPath;

        const routeObj: any = {
          path: innerPath,
          name: item.name || innerPath.replace(/^\//, '').replace(/\//g, '-'),
          meta: item.meta || {},
          children: []
        };

        if (item.children && item.children.length > 0) {
          routeObj.children = processRoutes(item.children);
        }

        if (innerPath && innerPath !== '/') {
          const safePath = innerPath.startsWith('/') ? innerPath : `/${innerPath}`;
          const indexPath = `../views${safePath}/index.vue`;
          const directPath = `../views${safePath}.vue`;
          
          // 使用全小写去匹配，再也不怕文件夹大小写写错了！
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

    // if (router.currentRoute.value.path === '/' && flatRoutes.length > 0) {
    //   router.replace(flatRoutes[0].path);
    // }
    const realBrowserPath = window.location.pathname;
    const isAtRoot = realBrowserPath === subAppPrefix || realBrowserPath === `${subAppPrefix}/`;
    
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