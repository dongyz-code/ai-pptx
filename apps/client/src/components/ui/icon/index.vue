<script setup lang="ts">
import { computed } from 'vue';
import * as IconifyIcons from './iconify-icons';
import * as LocalIcons from './local-icons';

const props = defineProps<{
  icon: IconName;
}>();

const iconMap = {
  ...IconifyIcons,
  ...LocalIcons,
};

type IconName = keyof typeof IconifyIcons | keyof typeof LocalIcons;

/**
 * 找到图标组件
 */
const IconComponent = computed(() => {
  const icon = iconMap[props.icon];

  if (!icon) {
    console.error(`Icon ${props.icon} not found`);
  }

  return icon;
});
</script>

<template>
  <component :is="IconComponent" height="1em" width="1em" color="currentColor" />
</template>

<style lang="less" scoped>

</style>
