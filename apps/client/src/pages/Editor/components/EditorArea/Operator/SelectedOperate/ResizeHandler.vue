<template>
  <div
    class="handler pointer-events-auto absolute z-10 -ml-[5px] -mt-[5px] h-3 w-3 rounded-full border border-gray-600 bg-white"
    :style="{ cursor }"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { OPERATE_RESIZE_HANDLERS } from '@/constants';
import ArrowTopBottom from '@/assets/images/arrow/arrow-top-bottom.webp';

const props = defineProps<{
  rotate: number;
  direction: OPERATE_RESIZE_HANDLERS;
}>();

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

<style lang="postcss" scoped>

</style>
