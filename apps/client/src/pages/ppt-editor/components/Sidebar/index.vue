<template>
  <div class="sidebar-container p-4">
    <div
      v-for="action in actions"
      :key="action.value"
      class="sidebar-item flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg text-center font-bold text-gray-600 transition-all hover:shadow-md"
      :class="{ 'bg-blue-50 shadow-md': activeAction?.value === action.value }"
      @click="handleActionClick($event, action)"
    >
      <div class="text-lg">
        <VIcon :icon="action.icon" />
      </div>
      <div class="text-xs">{{ action.label }}</div>
    </div>

    <teleport to="body">
      <transition name="fade">
        <div
          ref="floating"
          class="rounded-md bg-white shadow-md"
          v-if="activeAction"
          :style="floatingStyles"
        >
          <component :is="activeAction.component" @close="handleClose()" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { type Component, markRaw, nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { VIcon, IconName } from '@/components/ui';
import { useFloating, offset, flip, shift } from '@floating-ui/vue';

import TextContent from './contents/TextContent.vue';
import ShapeContent from './contents/ShapeContent.vue';
import LineContent from './contents/LineContent.vue';
import ImageContent from './contents/ImageContent.vue';
import TableContent from './contents/TableContent.vue';
import ChartContent from './contents/ChartContent.vue';

type ActionType = 'text' | 'shape' | 'line' | 'image' | 'table' | 'chart';

type ActionItem = { label: string; value: ActionType; icon: IconName; component: Component };

const actions = shallowRef<ActionItem[]>([
  {
    label: '文字',
    value: 'text',
    icon: 'solar:text-bold',
    component: markRaw(TextContent),
  },
  {
    label: '形状',
    value: 'shape',
    icon: 'fluent:shapes-24-regular',
    component: markRaw(ShapeContent),
  },
  {
    label: '线条',
    value: 'line',
    icon: 'uil:line-alt',
    component: markRaw(LineContent),
  },
  {
    label: '图片',
    value: 'image',
    icon: 'mage:image-fill',
    component: markRaw(ImageContent),
  },
  {
    label: '表格',
    value: 'table',
    icon: 'majesticons:table',
    component: markRaw(TableContent),
  },
  {
    label: '图表',
    value: 'chart',
    icon: 'teenyicons:donut-chart-solid',
    component: markRaw(ChartContent),
  },
]);

const reference = ref<HTMLDivElement | null>(null);
const floating = ref<HTMLDivElement | null>(null);
const activeAction = ref<ActionItem | null>(null);

const { floatingStyles, update } = useFloating(reference, floating, {
  placement: 'right-start',
  middleware: [offset(10), flip(), shift({ padding: 8 })],
});

const handleActionClick = async (event: Event, action: ActionItem) => {
  reference.value = event.currentTarget as HTMLDivElement;
  activeAction.value = action;
  await nextTick();
  update();
};

const handleClose = () => {
  activeAction.value = null;
  reference.value = null;
  floating.value = null;
};

const handleOutsideClick = (e: MouseEvent) => {
  if (!activeAction.value) {
    return;
  }

  const target = e.target as HTMLElement;
  const refEl = reference.value;
  const floatEl = floating.value;

  const isInsideRef = refEl && refEl.contains(target);
  const isInsideFloat = floatEl && floatEl.contains(target);

  if (!isInsideRef && !isInsideFloat) {
    activeAction.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.sidebar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  position: relative;
}
</style>
