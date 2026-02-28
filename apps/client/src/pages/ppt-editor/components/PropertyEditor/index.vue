<template>
  <Transition name="panel-slide">
    <div
      v-if="show"
      class="fixed top-0 right-0 z-[9999] flex h-screen w-80 flex-col border-l border-black/8 bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.08)]"
      @click.stop
    >
      <!-- 面板头部 -->
      <div
        class="flex shrink-0 items-center justify-between border-b border-black/7 px-4 pt-3.5 pb-3"
      >
        <div class="flex items-center gap-2.5">
          <!-- 类型徽章 -->
          <div
            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] text-sm font-bold"
            :class="badgeClass"
          >
            <span v-if="selectedElement">{{ typeIcon[selectedElement.type] }}</span>
            <span v-else>✦</span>
          </div>
          <div>
            <div class="text-[13px] leading-[1.3] font-semibold text-[#1a1a2e]">
              {{ elementTypeLabel }}
            </div>
            <div v-if="selectedElement" class="mt-px font-mono text-[10.5px] text-black/35">
              {{ selectedElement.id.slice(0, 8) }}
            </div>
          </div>
        </div>
        <button
          class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-black/10 bg-white text-black/50 transition-all duration-150 hover:border-black/20 hover:bg-[#f5f5f5] hover:text-[#1a1a2e]"
          title="关闭"
          @click="close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- 未选中提示 -->
      <div
        v-if="!selectedElement && !isMultiple"
        class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-black/40"
      >
        <div class="text-[32px] opacity-30">⬡</div>
        <p class="m-0 text-center text-[13px]">请在画布中选择一个元素</p>
      </div>

      <!-- 多选提示 -->
      <div
        v-else-if="isMultiple"
        class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-black/40"
      >
        <div class="text-[32px] opacity-30">⬡</div>
        <p class="m-0 text-center text-[13px]">已选中 {{ selectedCount }} 个元素</p>
        <p class="m-0 text-[11px] opacity-70">请选择单个元素以编辑属性</p>
      </div>

      <!-- 属性面板 -->
      <div
        v-else-if="selectedElement"
        class="scroll-bar flex flex-1 flex-col gap-2 overflow-y-auto p-3"
      >
        <!-- 通用：位置/尺寸/旋转 -->
        <CommonPanel v-if="boxElement" :element="boxElement" />

        <!-- 线条元素：仅提示 -->
        <PanelSection v-else-if="lineElement" title="位置与形态">
          <template #icon>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </template>
          <div class="text-[11px] leading-relaxed text-black/40">
            线条的位置与形态通过画布中的控制点调整。
          </div>
        </PanelSection>

        <!-- 各类型专属面板 -->
        <TextPanel v-if="textElement" :element="textElement" />
        <ImagePanel v-if="imageElement" :element="imageElement" />
        <ShapePanel v-if="shapeElement" :element="shapeElement" />
        <LinePanel v-if="lineElement" :element="lineElement" />
        <VideoPanel v-if="videoElement" :element="videoElement" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditor } from '../../models/editor';
import { useSelectedElements } from '../../hooks';
import CommonPanel from './panels/CommonPanel.vue';
import TextPanel from './panels/TextPanel.vue';
import ImagePanel from './panels/ImagePanel.vue';
import ShapePanel from './panels/ShapePanel.vue';
import LinePanel from './panels/LinePanel.vue';
import VideoPanel from './panels/VideoPanel.vue';
import PanelSection from './components/PanelSection.vue';
import type {
  PPTElement,
  PPTLineElement,
  PPTTextElement,
  PPTImageElement,
  PPTShapeElement,
  PPTVideoElement,
} from '@/types';

type BoxElement = Exclude<PPTElement, PPTLineElement>;

const { editorState, setShowPropertyPanel } = useEditor();
const { selectedElements } = useSelectedElements();

const show = computed(() => editorState.showPropertyPanel);
const close = () => setShowPropertyPanel(false);

const selectedCount = computed(() => selectedElements.value.length);
const isMultiple = computed(() => selectedCount.value > 1);

const selectedElement = computed<PPTElement | null>(() => {
  if (selectedElements.value.length !== 1) return null;
  return selectedElements.value[0] ?? null;
});

const boxElement = computed<BoxElement | null>(() =>
  selectedElement.value && selectedElement.value.type !== 'line'
    ? (selectedElement.value as BoxElement)
    : null
);
const textElement = computed<PPTTextElement | null>(() =>
  selectedElement.value?.type === 'text' ? (selectedElement.value as PPTTextElement) : null
);
const imageElement = computed<PPTImageElement | null>(() =>
  selectedElement.value?.type === 'image' ? (selectedElement.value as PPTImageElement) : null
);
const shapeElement = computed<PPTShapeElement | null>(() =>
  selectedElement.value?.type === 'shape' ? (selectedElement.value as PPTShapeElement) : null
);
const lineElement = computed<PPTLineElement | null>(() =>
  selectedElement.value?.type === 'line' ? (selectedElement.value as PPTLineElement) : null
);
const videoElement = computed<PPTVideoElement | null>(() =>
  selectedElement.value?.type === 'video' ? (selectedElement.value as PPTVideoElement) : null
);

const typeLabelMap: Record<PPTElement['type'], string> = {
  text: '文本',
  image: '图片',
  shape: '形状',
  line: '线条',
  video: '视频',
  table: '表格',
  chart: '图表',
  latex: '公式',
  audio: '音频',
};

const typeIcon: Record<PPTElement['type'], string> = {
  text: 'T',
  image: '⬡',
  shape: '◈',
  line: '╱',
  video: '▶',
  table: '⊞',
  chart: '◫',
  latex: 'Σ',
  audio: '♫',
};

const badgeColorMap: Partial<Record<PPTElement['type'], string>> = {
  text: 'bg-[#fff0f0] text-[#ef4444]',
  image: 'bg-[#f0fff4] text-[#22c55e]',
  shape: 'bg-[#fffbf0] text-[#f59e0b]',
  line: 'bg-[#f0f8ff] text-[#3b82f6]',
  video: 'bg-[#fdf4ff] text-[#a855f7]',
  table: 'bg-[#f0fffe] text-[#14b8a6]',
  chart: 'bg-[#fff4f0] text-[#f97316]',
};

const badgeClass = computed(() =>
  selectedElement.value
    ? (badgeColorMap[selectedElement.value.type] ?? 'bg-[#f0f0ff] text-indigo-500')
    : 'bg-[#f0f0ff] text-indigo-500'
);

const elementTypeLabel = computed(() =>
  selectedElement.value
    ? (typeLabelMap[selectedElement.value.type] ?? '元素') + ' 属性'
    : '属性编辑器'
);
</script>

<style>
/* Transition 类名必须是全局样式，scoped 会导致 Vue Transition 无法匹配 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
