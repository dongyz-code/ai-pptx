<script setup lang="ts">
import { computed } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import { arrObject } from '@/utils';
import { getElementsRange } from '@/pages/Editor/utils';

const { editorState } = useEditor();
const { state: slidesState } = useSlides();

/** 计算选中元素的包围盒 需要考虑旋转 */
const wrapperRect = computed(() => {
  if (editorState.selectedElementIds?.length <= 1) {
    return null;
  }

  const selectIdMap = arrObject(editorState.selectedElementIds);
  const slide = slidesState.slides[slidesState.sliderIndex];
  const elements = slide.elements.filter((element) => selectIdMap[element.id]);
  const { x1, x2, y1, y2 } = getElementsRange(elements);

  return {
    width: x2 - x1,
    height: y2 - y1,
    left: x1,
    top: y1,
  };
});
</script>

<template>
  <div
    v-if="wrapperRect"
    class="border-primary z-[1000] border bg-transparent"
    :style="{
      position: 'absolute',
      width: `${wrapperRect.width}px`,
      height: `${wrapperRect.height}px`,
      left: `${wrapperRect.left}px`,
      top: `${wrapperRect.top}px`,
    }"
  ></div>
</template>
