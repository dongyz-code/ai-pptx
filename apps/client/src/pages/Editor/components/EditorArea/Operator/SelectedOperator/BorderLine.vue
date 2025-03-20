<template>
  <div class="border-primary border-line absolute left-0 top-0 h-0 w-0 border-0" :class="[type]"></div>
</template>

<script setup lang="ts">
import type { OPERATE_LINE } from '@/constants';

defineProps<{
  type: OPERATE_LINE;
}>();
</script>

<style lang="scss" scoped>
.border-line {
  &.top {
    border-top-width: 1px;
  }
  &.bottom {
    border-bottom-width: 1px;
  }
  &.left {
    border-left-width: 1px;
  }
  &.right {
    border-right-width: 1px;
  }
}
</style>
