<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/user";

const router = useRouter();
const route = useRoute();

// 处理主应用发来的路由通知
const handleMicroRouteChange = (event: Event) => {
  // 1. 获取通知里的路径
  const detail = (event as CustomEvent).detail;
  if (!detail || !detail.path) return;

  const fullPath = detail.path; // e.g., "/{{APP_NAME}}/testView2"

  // 2. 掐头去尾，算出子应用内部路径
  // 假设 activeRule 是 "/{{APP_NAME}}"，需要把它去掉
  const targetPath = fullPath.replace("/{{APP_NAME}}", "") || "/";

  // 3. 如果当前路径不对，就跳过去
  if (route.path !== targetPath) {
    router.replace(targetPath);
  }
};
// 1. 定义处理函数：接收主应用发回来的最新权限
const handleSyncPermissions = (event: Event) => {
  const detail = (event as CustomEvent).detail;
  if (detail && detail.permissions) {
    const userStore = useUserStore();
    // x更新 Store -> 触发 auth-listener -> 添加路由 -> 页面显示
    userStore.permissions = [...detail.permissions];
  }
};

onMounted(() => {
  // 监听自定义事件
  window.removeEventListener("micro-app-route-change", handleMicroRouteChange);
  window.removeEventListener("global-sync-permissions", handleSyncPermissions);
  window.addEventListener("micro-app-route-change", handleMicroRouteChange);
  window.addEventListener("global-sync-permissions", handleSyncPermissions);
});

onUnmounted(() => {
  window.removeEventListener("micro-app-route-change", handleMicroRouteChange);
  window.removeEventListener("global-sync-permissions", handleSyncPermissions);
});
</script>
