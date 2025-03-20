<template>
  <div class="common-operator">
    <BorderLine v-for="item in operate.borderLines" :key="item.type" :type="item.type" :style="item.style" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCommonOperate } from '@/pages/Editor/utils';
import BorderLine from './BorderLine.vue';

import type { PPTVideoElement, PPTLatexElement, PPTAudioElement, PPTChartElement } from '@/types';

type PPTElementCommon = PPTVideoElement | PPTLatexElement | PPTAudioElement | PPTChartElement;

interface Props {
  element: PPTElementCommon;
}

const props = defineProps<Props>();

const width = computed(() => props.element.width);
const height = computed(() => props.element.height);
const operate = computed(() => getCommonOperate(width.value, height.value));
</script>
