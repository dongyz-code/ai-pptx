<template>
  <div
    class="pointer-events-auto absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
    :style="{ top: `-${props.offset}px`, height: `${props.offset}px` }"
    @mousedown="handleMouseDown"
  >
    <div
      class="bg-primary pointer-events-none absolute left-1/2 -translate-x-1/2"
      :style="{
        top: `${props.knobSize}px`,
        height: `${props.offset - props.knobSize}px`,
        width: '1px',
      }"
    ></div>
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border border-gray-600 bg-white"
      :style="{ width: `${props.knobSize}px`, height: `${props.knobSize}px` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    offset?: number;
    knobSize?: number;
  }>(),
  {
    offset: 28,
    knobSize: 12,
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
