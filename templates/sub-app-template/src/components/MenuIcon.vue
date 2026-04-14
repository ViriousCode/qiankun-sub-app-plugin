<template>
  <AzuraIcon class="menu-icon-wrapper" :icon="icon" :url-icon-base-url="MENU_URL_ICON_BASE_URL" :width="width"
    :height="height" />
</template>

<script setup lang="ts">
import { AzuraIcon } from '@npm/azura-icon';
import { MENU_URL_ICON_BASE_URL } from '@/config';

defineProps({
  icon: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 24
  },
  height: {
    type: [String, Number],
    default: 24
  }
});
</script>

<style scoped>
.menu-icon-wrapper {
  display: inline-flex;
}
</style>
