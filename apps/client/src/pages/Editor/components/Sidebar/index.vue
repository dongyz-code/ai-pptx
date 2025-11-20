<template>
  <div class="p-4">
    <div
      v-for="action in actions"
      :key="action.value"
      class="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg text-center font-bold text-gray-600 hover:shadow-md"
      @click="handleActionClick($event, action.value)"
    >
      <div class="text-lg">
        <VIcon :icon="action.icon" />
      </div>
      <div class="text-xs">{{ action.label }}</div>
    </div>

    <Popover ref="popover" @hide="activeAction = undefined"> 2323 </Popover>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, useTemplateRef } from 'vue';
import { VIcon, IconName } from '@/components/ui';
import { Popover } from 'primevue';
import { useAction } from './useAction';

type ActionType = 'text' | 'shape' | 'line' | 'image' | 'table' | 'chart';

const { onAddText } = useAction();
const popoverRef = useTemplateRef('popover');
const actions: { label: string; value: ActionType; icon: IconName }[] = [
  {
    label: '文字',
    value: 'text',
    icon: 'solar:text-bold',
  },
  {
    label: '形状',
    value: 'shape',
    icon: 'fluent:shapes-24-regular',
  },
  {
    label: '线条',
    value: 'line',
    icon: 'uil:line-alt',
  },
  {
    label: '图片',
    value: 'image',
    icon: 'mage:image-fill',
  },
  {
    label: '表格',
    value: 'table',
    icon: 'majesticons:table',
  },
  {
    label: '图表',
    value: 'chart',
    icon: 'teenyicons:donut-chart-solid',
  },
];

const activeAction = ref<ActionType>();

const handleActionClick = (e: Event, action: ActionType) => {
  activeAction.value = action;
  popoverRef.value?.show(e);
};
</script>

<style scoped></style>
