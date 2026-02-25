# Qiankun Sub-App Generator (qiankun 子应用生成器)

[![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-blue.svg)](https://code.visualstudio.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF.svg)](https://vitejs.dev/)

这是一个专为团队前端工程化打造的 VS Code 扩展插件。通过右键菜单，一键快速生成基于 `Vue 3 + Vite + qiankun` 的标准微前端子应用模板，告别繁琐的初始配置与跨域调试，极大提升团队研发效能！

## ✨ 核心特性 (Features)

* 🚀 **极速生成**：在资源管理器右键点击任意文件夹，瞬间完成整个子应用目录结构的初始化。
* 🏷️ **动态变量注入**：自动将你输入的 `appName` 注入到 `package.json`、`vite.config.ts`、路由前缀、全局通信事件以及 HTML 挂载点中。
* 🛡️ **智能过滤引擎**：内置防卡死机制，自动过滤模板中遗留的 `node_modules`、`.git`、`dist` 等无用目录，保证生成速度与纯净度。
* 🧩 **开箱即用**：模板内置 Vue Router、Pinia、Element Plus 及自动按需引入配置，生成完毕即可无缝接入主应用。

## 📦 安装 (Installation)

1. 下载本插件的 `.vsix` 安装包。
2. 打开 VS Code，进入左侧的 **扩展 (Extensions)** 面板。
3. 点击面板右上角的 `...` (更多操作) 图标。
4. 选择 **从 VSIX 安装... (Install from VSIX...)** 并选择下载的安装包。

## 💡 使用指南 (Usage)

1. 在 VS Code 的**资源管理器 (Explorer)** 中，找到你想要放置子应用工程的空文件夹。
2. 右键点击该文件夹（或在文件夹内部空白处右键），选择 **新建 qiankun 子应用 (Vue3+Vite)**。
3. 在顶部弹出的输入框中，输入你的**子应用英文名称**（例如：`sub-app-order`）。
4. 按下回车键，等待 1 秒钟，右下角提示“创建成功”后，标准工程即刻呈现在你的目录树中！

*(建议：这里可以放一张使用步骤的演示 GIF 动图)*

## ⚙️ 依赖环境 (Requirements)

要成功运行生成的模板代码，您的本地环境需要满足以下基本要求：
* **Node.js**: >= 20.19.0 或 >= 22.12.0
* **包管理器**: npm / pnpm / yarn 均可

## 🐛 已知问题 (Known Issues)

目前仅支持单一种类的预设模板生成。未来计划支持在输入框后加入“选择模板类型（如 React/Vue）”的下拉选项。如果您在使用中遇到问题，欢迎在项目的 GitHub 仓库提交 Issue。

## 📝 发行说明 (Release Notes)

### 1.0.0
* 🎉 首次发布！
* 实现右键一键生成 qiankun + Vue 3 + Vite 子应用核心功能。
* 加入全局文件递归扫描与 `{{APP_NAME}}` 动态插值替换能力。

---
**Enjoy coding with micro-frontends! 🚀**