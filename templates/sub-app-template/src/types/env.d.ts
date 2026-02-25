// src/types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 基础配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'dev' | 'test' | 'prod' | 'prod-standalone'
  readonly VITE_MODE: 'development' | 'test' | 'production'
  readonly VITE_STANDALONE?: 'true' | 'false'
  
  // 路径配置
  readonly VITE_BASE_URL: string
  
  // API 配置
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // 微前端配置
  readonly VITE_QIANKUN_NAME: string
  readonly VITE_QIANKUN_ENTRY: string
  readonly VITE_QIANKUN_ACTIVE_RULE: string
  
  // Cesium 配置
  readonly VITE_CESIUM_TOKEN: string
  readonly VITE_CESIUM_BASE_URL: string
  
  // 调试配置
  readonly VITE_DEBUG: 'true' | 'false'
  readonly VITE_CONSOLE_LOG: 'true' | 'false'
  readonly VITE_VUE_DEVTOOLS: 'true' | 'false'
  
  // 功能开关
  readonly VITE_ENABLE_MOCK: 'true' | 'false'
  readonly VITE_ENABLE_ANALYTICS: 'true' | 'false'
  readonly VITE_ENABLE_ERROR_REPORT: 'true' | 'false'
  readonly VITE_ENABLE_PERFORMANCE_MONITOR: 'true' | 'false'
  readonly VITE_PERFORMANCE_THRESHOLD: string
  
  // 安全配置
  readonly VITE_ENABLE_CSP: 'true' | 'false'
  readonly VITE_ENABLE_HSTS: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 1. 扩展 Vue 组件实例类型 (用于 this.$mainNavigate)
// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $mainNavigate: (path: string) => void;
//   }
// }

// 2. 扩展 Window 全局对象类型 (用于 window.$mainNavigate)
interface Window {
  $mainNavigate: (path: string) => void;
}