<template>
  <div
    class="opreate-wrapper absolute"
    :style="{
      left: element.left + 'px',
      top: element.top + 'px',
      transform: `rotate(${rotate}deg)`,
      height: height + 'px',
      width: element.width + 'px',
    }"
  >
    <component :is="OperateComponent" :element="element" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CommonOperator from './CommonOperate.vue';
import LineOperate from './LineOperate.vue';

import type { Component } from 'vue';
import type { PPTElement } from '@/types';

const props = defineProps<{
  element: PPTElement;
}>();

const OperateComponentMap: Record<PPTElement['type'], Component> = {
  line: LineOperate,
  text: CommonOperator,
  image: CommonOperator,
  shape: CommonOperator,
  video: CommonOperator,
  audio: CommonOperator,
  chart: CommonOperator,
  table: CommonOperator,
  latex: CommonOperator,
};

const OperateComponent = computed(() => OperateComponentMap[props.element.type] || null);
const rotate = computed(() => ('rotate' in props.element ? props.element.rotate : 0));
const height = computed(() => ('height' in props.element ? props.element.height : 0));
</script>

<style lang="scss" scoped></style>
