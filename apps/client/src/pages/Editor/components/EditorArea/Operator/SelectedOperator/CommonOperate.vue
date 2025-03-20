<template>
  <div class="common-operator">
    <BorderLine v-for="item in operate.borderLines" :key="item.type" :type="item.type" :style="item.style" />
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useEditor } from '@/pages/Editor/models';
import { getCommonOperate } from '@/pages/Editor/utils';
import BorderLine from './BorderLine.vue';

import type { PPTVideoElement, PPTLatexElement, PPTAudioElement, PPTChartElement } from '@/types';

type PPTElementCommon = PPTVideoElement | PPTLatexElement | PPTAudioElement | PPTChartElement;

interface Props {
  element: PPTElementCommon;
}

const props = defineProps<Props>();
const { editorState } = useEditor();
const { viewportScale } = toRefs(editorState);

const width = computed(() => props.element.width * viewportScale.value);
const height = computed(() => props.element.height * viewportScale.value);
const operate = computed(() => getCommonOperate(width.value, height.value));
</script>
