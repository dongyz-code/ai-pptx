<template>
  <div class="common-operator">
    <template v-if="editor.editorState.selectedElementIds.length === 1">
      <RotateHandler
        :hidden="isRotating"
        @mousedown="($event: MouseEvent) => rotateElement($event, element)"
      ></RotateHandler>
      <resize-handler
        v-for="(item, i) in operate.resizeHandlers"
        :key="i"
        :style="{ ...item.style }"
        :direction="item.direction"
        :rotate="element.rotate"
        @mousedown="($event: MouseEvent) => scaleElement($event, element, item.direction)"
      ></resize-handler>
    </template>

    <BorderLine
      v-for="item in operate.borderLines"
      :key="item.type"
      :type="item.type"
      :style="item.style"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { OPERATE_RESIZE_HANDLERS } from '@/constants';
import { getCommonOperate } from '@/pages/ppt-editor/utils';
import { useEditor } from '@/pages/ppt-editor/models';

import BorderLine from './BorderLine.vue';
import ResizeHandler from './ResizeHandler.vue';
import RotateHandler from '../RotateHandler.vue';

import type {
  PPTVideoElement,
  PPTLatexElement,
  PPTAudioElement,
  PPTChartElement,
  PPTElement,
  PPTLineElement,
} from '@/types';

type PPTElementCommon = PPTVideoElement | PPTLatexElement | PPTAudioElement | PPTChartElement;

interface Props {
  element: PPTElementCommon;
  scaleElement: (
    e: MouseEvent,
    element: Exclude<PPTElement, PPTLineElement>,
    command: OPERATE_RESIZE_HANDLERS
  ) => void;
  rotateElement: (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>) => void;
  isRotating: boolean;
}

const props = defineProps<Props>();

const editor = useEditor();

const width = computed(() => props.element.width);
const height = computed(() => props.element.height);
const operate = computed(() => getCommonOperate(width.value, height.value));
</script>
