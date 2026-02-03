<template>
  <div>
    <resize-handler
      v-for="(item, i) in handlers"
      :key="i"
      :style="{ ...item.position }"
      @mousedown="($event: MouseEvent) => dragLineElement($event, element, item.type)"
    ></resize-handler>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ResizeHandler from './ResizeHandler.vue';
import { PPTLineElement, OperateLineHandlers } from '@/types';

const props = defineProps<{
  element: PPTLineElement;
  dragLineElement: (e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => void;
}>();

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
    const p =
      props.element.broken || props.element.broken2 || (props.element.curve as [number, number]);
    handlers.push({
      type: OperateLineHandlers.C,
      position: {
        left: p[0] + 'px',
        top: p[1] + 'px',
      },
    });
  } else if (props.element.cubic) {
    const [c1, c2] = props.element.cubic;
    handlers.push({
      type: OperateLineHandlers.C1,
      position: {
        left: c1[0] + 'px',
        top: c1[1] + 'px',
      },
    });
    handlers.push({
      type: OperateLineHandlers.C2,
      position: {
        left: c2[0] + 'px',
        top: c2[1] + 'px',
      },
    });
  }

  return handlers;
});
</script>

<style lang="scss" scoped></style>
