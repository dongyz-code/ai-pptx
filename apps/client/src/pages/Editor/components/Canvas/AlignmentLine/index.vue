<script setup lang="ts">
import { computed } from 'vue';
import type { AlignmentLineProps } from '@/types';

interface Props {
  type: AlignmentLineProps['type'];
  axis: AlignmentLineProps['axis'];
  length: AlignmentLineProps['length'];
  canvasScale: number;
}

const props = defineProps<Props>();

/** 吸附线的位置 */
const left = computed(() => `${props.axis.x}px`);
const top = computed(() => `${props.axis.y}px`);

/** 线的长度 */
const sizeStyle = computed(() => {
  return props.type === 'horizontal' ? { width: `${props.length}px` } : { height: `${props.length}px` };
});
</script>

<template>
  <div class="alignment-line absolute z-[100]" :style="{ left, top }">
    <div
      :style="sizeStyle"
      class="line h-0 w-0 border-dashed border-[var(--p-primary-color)]"
      :class="{
        '-translate-x-[0.5px] border-l': props.type === 'vertical',
        '-translate-y-[0.5px] border-t': props.type === 'horizontal',
      }"
    ></div>
  </div>
</template>
