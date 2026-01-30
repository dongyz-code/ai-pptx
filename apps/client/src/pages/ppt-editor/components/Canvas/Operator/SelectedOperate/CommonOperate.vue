<template>
  <div class="common-operator">
    <template v-if="editor.editorState.selectedElementIds.length === 1">
      <resize-handler
        v-for="item in operate.resizeHandlers"
        :style="{ ...item.style }"
        :direction="item.direction"
        :rotate="element.rotate"
        @mousedown.nativate="($event: MouseEvent) => scaleElement($event, element, item.direction)"
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
import { getCommonOperate } from '@/pages/Editor/utils';
import { useEditor } from '@/pages/Editor/models';

import BorderLine from './BorderLine.vue';
import ResizeHandler from './ResizeHandler.vue';

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
}

const props = defineProps<Props>();

const editor = useEditor();

const width = computed(() => props.element.width);
const height = computed(() => props.element.height);
const operate = computed(() => getCommonOperate(width.value, height.value));
</script>
