<template>
  <div
    class="handler hover:bg-primary pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-600 bg-white"
    :style="pointerStyle"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, StyleValue } from 'vue';
import { OPERATE_RESIZE_HANDLERS } from '@/constants';
import ArrowTopBottom from '@/assets/images/arrow/arrow-top-bottom.webp';

const props = withDefaults(
  defineProps<{
    rotate?: number;
    direction?: OPERATE_RESIZE_HANDLERS;
  }>(),
  {
    rotate: 0,
  }
);

const cursor = ref('');

const cursorAngle = computed(() => {
  switch (props.direction) {
    case OPERATE_RESIZE_HANDLERS.TOP:
    case OPERATE_RESIZE_HANDLERS.BOTTOM:
      return props.rotate;
    case OPERATE_RESIZE_HANDLERS.LEFT:
    case OPERATE_RESIZE_HANDLERS.RIGHT:
      return props.rotate + 90;
    case OPERATE_RESIZE_HANDLERS.LEFT_TOP:
    case OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM:
      return props.rotate - 45;
    case OPERATE_RESIZE_HANDLERS.RIGHT_TOP:
    case OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM:
      return props.rotate + 45;
    default:
      return 0;
  }
});

const pointerStyle = computed(() => {
  const style: StyleValue = {
    cursor: cursor.value,
  };

  const baseSize = 8;

  switch (props.direction) {
    case OPERATE_RESIZE_HANDLERS.TOP:
    case OPERATE_RESIZE_HANDLERS.BOTTOM:
      style.width = `${baseSize * 2}px`;
      style.height = `${baseSize}px`;
      break;
    case OPERATE_RESIZE_HANDLERS.LEFT:
    case OPERATE_RESIZE_HANDLERS.RIGHT:
      style.width = `${baseSize}px`;
      style.height = `${baseSize * 2}px`;
      break;
    default:
      style.width = `${baseSize * 1.5}px`;
      style.height = `${baseSize * 1.5}px`;
      break;
  }

  return style;
});

const createRotateCursor = async () => {
  const img = new Image();
  img.src = ArrowTopBottom;

  return new Promise<string>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 24;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(size / 2, size / 2);
        ctx.rotate((cursorAngle.value * Math.PI) / 180);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        const dataURL = canvas.toDataURL();
        resolve(dataURL);
      }
    };
  });
};

watchEffect(async () => {
  const img = await createRotateCursor();
  cursor.value = `url(${img}) 12 12, auto`;
});
</script>

<style lang="postcss" scoped></style>
