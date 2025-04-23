<script setup lang="ts">
import { computed } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';

const { editorState } = useEditor();
const { state: slidesState } = useSlides();

const elementInfo = computed(() => {
  const selectIds = editorState.selectedElementIds;
  const hoverId = editorState.hoverElementId;

  if (!hoverId || selectIds.includes(hoverId)) {
    return null;
  }
  const slide = slidesState.slides[slidesState.sliderIndex];
  const element = slide.elements.find((element) => element.id === hoverId);
  if (!element || element.type === 'line') return null;

  const { width, left, top } = element;
  let height = 'height' in element ? element.height : 0;
  let rotate = 'rotate' in element ? element.rotate : 0;

  return { width, height, left, top, rotate };
});
</script>

<template>
  <div
    v-if="elementInfo"
    class="hover-operator"
    :style="{
      position: 'absolute',
      width: `${elementInfo.width}px`,
      height: `${elementInfo.height || 0}px`,
      left: `${elementInfo.left}px`,
      top: `${elementInfo.top}px`,
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
  ></div>
</template>

<style lang="scss" scoped>
.hover-operator {
  z-index: 1000;
  background-color: transparent;
  border: 1.5px dashed var(--p-primary-color);
}
</style>
