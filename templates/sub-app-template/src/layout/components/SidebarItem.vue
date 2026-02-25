<template>
  <template v-if="!item.meta?.hidden">
    <el-menu-item 
      v-if="!item.children || item.children.length === 0" 
      :index="resolvePath(item.path)"
    >
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{ 
  item: RouteRecordRaw; 
  basePath?: string 
}>();

const resolvePath = (routePath: string) => {
  // 安全校验
  if (!routePath) return '';
  
  if (routePath.startsWith('/') || routePath.startsWith('http')) {
    return routePath;
  }

  const parentPath = props.basePath || '';
  if (parentPath === routePath) return routePath;
  
  // 简单拼接，避免重复斜杠
  return `${parentPath}/${routePath}`.replace(/\/+/g, '/');
};
</script>