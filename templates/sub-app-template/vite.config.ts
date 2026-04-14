import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import qiankun from 'vite-plugin-qiankun'

function qiankunInjectedPublicPathForIndexHtml() {
  /**
   * qiankun 运行时注入 window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
   * 产物中内联 `import('./assets/xxx.js')` 在主应用文档下会解析错误；改为基于 publicPath 的绝对地址。
   */
  return {
    name: 'qiankun-injected-public-path-index-html',
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /import\((['"])\.\/assets\//g,
        "import((window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/') + 'assets/"
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const plugins = [
    vue(),
    qiankun('{{APP_NAME}}', {
      useDevMode: mode !== 'production',
    }),
    qiankunInjectedPublicPathForIndexHtml(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',  // 生成类型声明文件
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: 'src/components.d.ts',  // 生成组件类型声明
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',  // 使用 sass
        }),
      ],
    }),
  ]
  if (env.VITE_SHOW_DEVTOOLS === 'true' && mode !== 'production') {
    console.log('Vue DevTools enabled')
    plugins.push(vueDevTools())
  }
  return {
    // 独立开发 base 与 activeRule 一致；生产相对路径，避免资源解析到主应用根路径404
    base: mode === 'production' ? './' : '/{{APP_NAME}}/',
    plugins,
    server: {
      port: 5179,
      strictPort: true,
      cors: true, // 必须允许跨域
      origin: 'http://localhost:5179',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // 后端地址
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
