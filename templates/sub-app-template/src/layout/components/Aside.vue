<template>
  <el-scrollbar>
    <el-menu
      router
      :default-active="activeMenu"
      mode="vertical"
      :collapse="false"
      :unique-opened="true"
      class="sidebar-menu"
    >
      <sidebar-item
        v-for="route in permissionStore.menus"
        :key="route.path"
        :item="route"
        base-path=""
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import { usePermissionStore } from "@/store/permission";

const route = useRoute();
const permissionStore = usePermissionStore();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.sidebar-menu {
  border-right: none;
  padding: 8px 8px;
  background: transparent;
}

:deep(.el-menu) {
  background-color: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  margin: 4px 0;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
  padding: 0 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

:deep(.el-sub-menu .el-menu-item) {
  padding: 0 14px 0 28px;
  background-color: transparent !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: #2A78FF !important;
  color: #FFFFFF !important;
  font-weight: 500 !important;
}

:deep(.el-menu-item:hover .el-icon),
:deep(.el-menu-item:hover span),
:deep(.el-sub-menu__title:hover .el-icon),
:deep(.el-sub-menu__title:hover span) {
  color: #fff !important;
  font-weight: 500 !important;
}

:deep(.el-menu-item.is-active) {
  background: #2A78FF !important;
  border-radius: 8px;
  font-weight: 500 !important;
  color: #ffffff;
  line-height: 48px;
}

:deep(.el-menu-item.is-active .el-icon),
:deep(.el-menu-item.is-active span) {
  color: #fff !important;
  font-weight: 500 !important;
}
</style>
