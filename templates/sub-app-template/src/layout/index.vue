<template>
  <div v-if="isQiankun" class="sub-app-layout">
    <router-view />
  </div>

  <el-container v-else class="local-layout">
    <el-aside width="210px" class="local-aside">
      <Aside />
    </el-aside>

    <el-container>
      <el-header class="local-header">
        <div class="header-left">
          <span class="app-title">子应用独立开发环境</span>
        </div>
        <el-tag type="warning" size="small">Standalone</el-tag>
      </el-header>

      <el-main class="local-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import Aside from "./components/Aside.vue";

const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__;
</script>

<style scoped>
.sub-app-layout {
  min-height: 100%;
}

.local-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.local-aside {
  background-color: #304156;
  overflow-x: hidden;
}

.local-header {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.app-title {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.local-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
