<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditor, useKeyboard, useSlides } from '../../models';
import {
  useViewportSize,
  useDragElement,
  useSelectElement,
  useSelectedElements,
  useScaleElement,
  useScaleCanvas,
} from '../../hooks';

import EditorElement from './EditorElement';
import HoverOperator from './Operator/HoverOperator/index.vue';
import SelectedOperator from './Operator/SelectedOperate/index.vue';
import MultipleSelectedOperator from './Operator/MultipleSelectedOperator/index.vue';
import AlignmentLine from './AlignmentLine/index.vue';

import type { AlignmentLineProps } from '@/types';
import { useDragLineOperator } from '../../hooks/useDragLineOperator';

const wrapperRef = ref<HTMLDivElement>();

/** store 数据 */
const { editorState, setHoverElementId, setIsCanvasFocus, setSelectedElementIds } = useEditor();
const { state } = useSlides();

/** hooks 调用 */
const { keyboardState } = useKeyboard();
const alignmentLineList = ref<AlignmentLineProps[]>([]);
const { positionStyle } = useViewportSize(wrapperRef);
const { onDragElement } = useDragElement(alignmentLineList);
const { onDragLineOperator } = useDragLineOperator();
const { onSelectElement } = useSelectElement(onDragElement);
const { selectedElements } = useSelectedElements();
const { scaleElement } = useScaleElement(alignmentLineList);
const { scaleCanvas } = useScaleCanvas();

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

/**
 * 滚轮滚动
 */
const onMouseWheel = (e: WheelEvent) => {
  e.preventDefault();
  e.stopPropagation();

  /** 按下Ctrl，缩放画布 */
  if (keyboardState.isCtrlKey) {
    scaleCanvas(e.deltaY < 0 ? 'zoomIn' : 'zoomOut');
    return;
  }
};
</script>

<template>
  <div class="editor-wrapper relative overflow-hidden" ref="wrapperRef" @wheel="onMouseWheel">
    <div
      id="editor-canvas"
      class="canvas absolute transform-gpu overflow-hidden shadow-lg"
      :style="positionStyle"
      @mousedown="onClickBlankArea"
      @dblclick="onDoubleClickBlankArea"
    >
      <div
        class="viewport absolute top-0 left-0 origin-center"
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
      <div
        class="absolute top-0 left-0 origin-center"
        :style="{ transform: `scale(${editorState.viewportScale})` }"
      >
        <!-- Hover 框 -->
        <HoverOperator />

        <!-- 多选选择框 -->
        <MultipleSelectedOperator />

        <!-- 选择选择框 -->
        <SelectedOperator
          v-for="element in selectedElements"
          :key="element.id"
          :element="element"
          :scale-element="scaleElement"
          :drag-line-element="onDragLineOperator"
        />

        <!-- 吸附对齐线 -->
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
