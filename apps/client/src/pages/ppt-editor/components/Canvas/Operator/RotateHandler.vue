<template>
  <div
    v-if="!props.hidden"
    class="pointer-events-auto absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
    :style="{ top: `calc(100% + ${props.offset}px)` }"
    @mousedown="handleMouseDown"
  >
    <div
      class="flex items-center justify-center rounded-full bg-white text-sm text-gray-500 shadow-sm"
      :style="{ width: `${props.knobSize}px`, height: `${props.knobSize}px` }"
    >
      <v-icon icon="fluent:arrow-sync-24-filled"></v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@/components/ui';

const props = withDefaults(
  defineProps<{
    offset?: number;
    knobSize?: number;
    hidden?: boolean;
  }>(),
  {
    offset: 20,
    knobSize: 22,
    hidden: false,
  }
);

const emit = defineEmits<{
  (e: 'mousedown', event: MouseEvent): void;
}>();

const handleMouseDown = (event: MouseEvent) => {
  emit('mousedown', event);
};
</script>

<style lang="scss" scoped></style>
