<template>
  <el-scrollbar>
    <el-menu
      router
      :default-active="activeMenu"
      mode="vertical"
      :collapse="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
    >
      <sidebar-item
        v-for="route in permissionStore.menus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import SidebarItem from "./SidebarItem.vue";
import { usePermissionStore } from "@/store/permission";
const route = useRoute();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const activeMenu = computed(() => route.path);
// const activeMenu = computed(() => route.path);

// const menuList = computed(() => {
//   // 乾坤环境：用主应用下发的菜单
//   if (qiankunWindow.__POWERED_BY_QIANKUN__) {
//     return userStore.dynamicMenus || [];
//   }

//   // 独立环境：用本地路由，过滤掉 hidden 的
//   return asyncRoutes.filter(item => !item.meta?.hidden);
// });
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
