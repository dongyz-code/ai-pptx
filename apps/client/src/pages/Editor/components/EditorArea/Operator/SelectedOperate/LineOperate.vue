<template>
  <div>
    <resize-handler v-for="(item, i) in handlers" :key="i" :style="{ ...item.position }"></resize-handler>

    <svg :width="svgWidth || 1" :height="svgHeight || 1" :stroke="element.color">
      <template v-if="element.curve">
        <g>
          <line
            class="anchor-line"
            :x1="element.start[0]"
            :y1="element.start[1]"
            :x2="element.curve[0]"
            :y2="element.curve[1]"
          ></line>
          <line
            class="anchor-line"
            :x1="element.end[0]"
            :y1="element.end[1]"
            :x2="element.curve[0]"
            :y2="element.curve[1]"
          ></line>
        </g>
      </template>
      <template v-if="element.cubic">
        <g v-for="(item, index) in element.cubic" :key="index">
          <line
            class="anchor-line"
            v-if="index === 0"
            :x1="element.start[0]"
            :y1="element.start[1]"
            :x2="item[0]"
            :y2="item[1]"
            fill="#FF0000"
          ></line>
          <line
            class="anchor-line"
            v-if="index === 1"
            :x1="element.end[0]"
            :y1="element.end[1]"
            :x2="item[0]"
            :y2="item[1]"
          ></line>
        </g>
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ResizeHandler from './ResizeHandler.vue';
import { PPTLineElement, OperateLineHandlers } from '@/types';

const props = defineProps<{
  element: PPTLineElement;
}>();

const svgWidth = computed(() => Math.max(props.element.start[0], props.element.end[0]));
const svgHeight = computed(() => Math.max(props.element.start[1], props.element.end[1]));

const handlers = computed(() => {
  const handlers: {
    type: OperateLineHandlers;
    position: {
      left?: string;
      top?: string;
      right?: string;
      bottom?: string;
    };
  }[] = [
    {
      type: OperateLineHandlers.START,
      position: {
        left: `${props.element.start[0]}px`,
        top: `${props.element.start[1]}px`,
      },
    },
    {
      type: OperateLineHandlers.END,
      position: {
        left: `${props.element.end[0]}px`,
        top: `${props.element.end[1]}px`,
      },
    },
  ];

  if (props.element.broken || props.element.broken2 || props.element.curve) {
    const p = props.element.broken || props.element.broken2 || (props.element.curve as [number, number]);
    handlers.push({
      type: OperateLineHandlers.C,
      position: {
        left: p[0] + 'px',
        top: p[1] + 'px',
      },
    });
  } else if (props.element.broken2) {
  }

  return handlers;
});
</script>

<style lang="scss" scoped>
svg {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  transform-origin: 0 0;
}
.anchor-line {
  stroke-width: 1px;
  stroke-dasharray: 5 5;
  opacity: 0.5;
}
</style>
