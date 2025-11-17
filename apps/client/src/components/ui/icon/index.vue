<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import IconifyIcons from './iconify-icons';
import LocalIcons from './local-icons';
import type { IconName } from './types';

export interface IconProps {
  /** 图标名称 */
  icon: IconName;
  /** 图标大小，默认 1em */
  size?: string | number;
  /** 图标颜色，默认 currentColor */
  color?: string;
}

const props = withDefaults(defineProps<IconProps>(), {
  size: '1em',
  color: 'currentColor',
});

// 图标映射表 - 合并所有图标（异步加载函数）
const iconMap: Record<string, () => Promise<Component>> = {
  ...IconifyIcons,
  ...LocalIcons,
};

/**
 * 动态获取图标组件（异步加载）
 */
const IconComponent = computed(() => {
  const iconLoader = iconMap[props.icon];

  if (!iconLoader) {
    if (import.meta.env.DEV) {
      console.error(`[Icon] 图标未找到: "${props.icon}"`);
    }
    return null;
  }

  // 将异步加载函数转换为异步组件
  return defineAsyncComponent(iconLoader);
});

/**
 * 计算图标尺寸
 */
const computedSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`;
  }
  return props.size;
});
</script>

<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
    :height="computedSize"
    :width="computedSize"
    :color="color"
  />
</template>

<style scoped>
/* 确保图标继承父元素的字体大小和颜色 */
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
