<template>
  <div v-if="isQiankun" class="sub-app-layout">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>

  <!-- 独立运行：对齐主应用 Navbar + Sidebar + AppMain -->
  <div v-else class="app-wrapper">
    <div class="navbar">
      <div class="left-panel">
        <div class="header-app">
          <span class="header-app__title">{{ appTitle }}</span>
        </div>
      </div>
      <div class="right-panel">
        <div class="header-badge">Standalone</div>
      </div>
    </div>

    <div class="main-container">
      <div class="sidebar-box">
        <Aside />
      </div>

      <div class="app-main">
        <div class="app-main__content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import Aside from "./components/Aside.vue";

const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__;
/** 脚手架会将 {{APP_NAME}} 替换为实际应用名 */
const appTitle = "{{APP_NAME}}";
</script>

<style scoped>
.sub-app-layout {
  min-height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  width: 100%;
  height: 66px;
  background: linear-gradient(180deg, #D4E2FD 0%, #DAE7FD 100%);
  box-shadow: 0px 2px 4px 0px rgba(0, 48, 118, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 52px 0 24px;
  z-index: 1002;
}

.left-panel {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-app {
  height: 36px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.header-app__title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #2E2F3D;
  line-height: 20px;
}

.right-panel {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-badge {
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  display: inline-flex;
  align-items: center;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 12px;
  color: #2E2F3D;
}

.main-container {
  display: flex;
  height: calc(100vh - 66px);
  background-color: transparent;
}

.sidebar-box {
  width: 230px;
  flex-shrink: 0;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
}

.app-main {
  flex: 1;
  width: calc(100vw - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background-color: #f0f2f5;
}

.app-main__content {
  min-height: 0%;
  position: relative;
}

.fade-transform-leave-active {
  position: absolute;
  inset: 0;
  transition: opacity 0.2s ease;
}

.fade-transform-enter-active {
  transition: opacity 0.2s ease 0.3s;
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
}

.app-main::-webkit-scrollbar {
  display: none;
}
</style>
