<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditor, useSlides } from '../../models';
import { useViewportSize, useDragElement, useSelectElement, useSelectedElements } from '../../hooks';

import EditorElement from './EditorElement';
import HoverOperator from './Operator/HoverOperator/index.vue';
import SelectedOperator from './Operator/SelectedOperate/index.vue';
import MultipleSelectedOperator from './Operator/MultipleSelectedOperator/index.vue';

import type { AlignmentLineProps } from '@/types';
import AlignmentLine from './AlignmentLine/index.vue';

const wrapperRef = ref<HTMLDivElement>();
const { editorState, setHoverElementId, setIsCanvasFocus, setSelectedElementIds } = useEditor();
const { state } = useSlides();
const alignmentLineList = ref<AlignmentLineProps[]>([]);
const { positionStyle } = useViewportSize(wrapperRef);
const { onInitDragElement } = useDragElement(alignmentLineList);
const { onSelectElement } = useSelectElement(onInitDragElement);
const { selectedElements } = useSelectedElements();

const currentSlide = computed(() => state.slides[state.sliderIndex]);

/** 点击空白区域: 清空选中元素，设置画布焦点 */
const onClickBlankArea = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    setSelectedElementIds([]);
    setIsCanvasFocus(true);
    setHoverElementId(null);
  }
};

/** 双击空白区域 */
const onDoubleClickBlankArea = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    e.preventDefault();
    e.stopPropagation();
    setIsCanvasFocus(false);
  }
};
</script>

<template>
  <div class="editor-wrapper relative" ref="wrapperRef">
    <div
      id="editor-canvas"
      class="canvas absolute transform-gpu shadow-lg"
      :style="positionStyle"
      @mousedown="onClickBlankArea"
      @dblclick="onDoubleClickBlankArea"
    >
      <div
        class="viewport absolute left-0 top-0 origin-top-left"
        :style="{ transform: `scale(${editorState.viewportScale})` }"
      >
        <EditorElement
          v-for="(element, index) in currentSlide.elements"
          :key="element.id"
          :element="element"
          :z-index="index + 1"
          :selectElement="onSelectElement"
        />
      </div>
    </div>

    <div class="pointer-events-none absolute transform-gpu" :style="positionStyle">
      <div class="absolute left-0 top-0 origin-top-left" :style="{ transform: `scale(${editorState.viewportScale})` }">
        <HoverOperator />
        <MultipleSelectedOperator />
        <SelectedOperator v-for="element in selectedElements" :element="element" />

        <AlignmentLine
          v-for="(line, index) in alignmentLineList"
          :key="index"
          :type="line.type"
          :axis="line.axis"
          :length="line.length"
          :canvas-scale="editorState.viewportScale"
        />
      </div>
    </div>
  </div>
</template>
