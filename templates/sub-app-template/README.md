# qiankun 微前端子应用使用说明 (Vue 3 + Vite)

本文档适用于由插件自动生成的基于 **Vue 3** 和 **Vite** 构建的 qiankun 微前端子应用。项目已内置微前端相关配置，开箱即用。

## 🚀 快速开始

### 1. 依赖安装
进入子应用根目录，执行以下命令安装依赖：

```bash
npm install
npm run dev
```

启动后，子应用将默认运行在本地的指定端口（如 http://localhost:5179，具体端口号请参考 vite.config.ts 中的 server 配置）。

然后将 src\store\permission.ts 里 usePermissionStore 中 APP_NAME 改为在主应用中应用管理保存的应用名称

主应用挂载容器无特殊情况(同时展示两个子应用)一般为#sub-app-container

菜单、权限在主应用中菜单管理配置，配置完后需要在角色管理中打开所需权限
