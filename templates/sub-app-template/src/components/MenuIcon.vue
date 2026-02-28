<template>
  <el-icon v-if="!icon" class="menu-icon-wrapper"></el-icon>

  <el-icon v-else-if="isIconfont" class="menu-icon-wrapper">
    <svg aria-hidden="true" class="custom-svg-icon">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </el-icon>

  <el-icon v-else class="menu-icon-wrapper">
    <component :is="icon" />
  </el-icon>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    icon: {
      type: String,
      default: ''
    }
  });

  // 判断是否为 Iconfont 的类名
  const isIconfont = computed(() => {
    return props.icon && props.icon.startsWith('icon-');
  });
</script>

<style scoped>
  /* 统一外部包装器的大小和间距，完美模拟 Element 官方菜单标准 */
  .menu-icon-wrapper {
    width: 24px !important;
    text-align: center !important;
    font-size: 18px !important; /* 图标的基准大小 */
    margin-right: 5px !important;
    vertical-align: middle !important;
  }

  /* 让 SVG 变成流体，完全撑满父级 el-icon 的空间 */
  /* 修改这里：让 SVG 变成流体，并稍微放大填补内部留白 */
  .custom-svg-icon {
    width: 1.15em; /* 👈 从 1em 调大到 1.15em 左右 */
    height: 1.15em; /* 👈 从 1em 调大到 1.15em 左右 */
    vertical-align: -0.2em; /* 👈 稍微下沉一点点，保持视觉绝对垂直居中 */
    fill: currentColor;
    overflow: hidden;
  }
</style>
