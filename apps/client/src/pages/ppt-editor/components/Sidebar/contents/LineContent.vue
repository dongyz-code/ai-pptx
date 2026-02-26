<template>
  <div class="line-content space-y-3 p-1">
    <section
      v-for="section in sections"
      :key="section.key"
      class="rounded-xl border border-black/10 bg-white p-2"
    >
      <div class="mb-2 px-1 text-[11px] font-medium tracking-[0.24em] text-black/45">
        {{ section.title }}
      </div>

      <div class="grid grid-cols-1 gap-1.5">
        <div
          v-for="option in section.options"
          :key="option.value"
          class="group flex cursor-grab items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-black transition-all hover:border-black hover:bg-black hover:text-white active:cursor-grabbing"
          draggable="true"
          :title="option.label"
          @dragstart="onDragStart($event, option)"
          @click="handleClick(option)"
        >
          <div
            class="flex h-7 w-14 items-center justify-center rounded-md border border-black/15 bg-white text-current group-hover:border-white/40 group-hover:bg-black"
            v-html="option.preview"
          ></div>
          <div class="text-sm leading-none">{{ option.label }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { startElementDrag } from '../../../hooks/useDragCreate';
import { useAction } from '../useAction';
import type { PPTLineElement } from '@/types';

type LineElementTemplate = Omit<PPTLineElement, 'id' | 'left' | 'top'>;

interface LineOption {
  label: string;
  value: string;
  preview: string;
  data: LineElementTemplate;
}

interface LineSection {
  key: 'straight' | 'broken' | 'curve';
  title: '直线' | '折线' | '曲线';
  options: LineOption[];
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { onAddLine } = useAction();

const sections: LineSection[] = [
  {
    key: 'straight',
    title: '直线',
    options: [
      {
        label: '直线',
        value: 'straight-solid',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><line x1="6" y1="10" x2="58" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', ''],
          color: '#111111',
        },
      },
      {
        label: '虚线',
        value: 'straight-dashed',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><line x1="6" y1="10" x2="58" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="8 5"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'dashed',
          points: ['', ''],
          color: '#111111',
        },
      },
      {
        label: '单箭头',
        value: 'straight-arrow',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><line x1="6" y1="10" x2="52" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M50 6 L58 10 L50 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', 'arrow'],
          color: '#111111',
        },
      },
      {
        label: '双端圆点',
        value: 'straight-dot',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><line x1="10" y1="10" x2="54" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="10" r="2.2" fill="currentColor"/><circle cx="56" cy="10" r="2.2" fill="currentColor"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['dot', 'dot'],
          color: '#111111',
        },
      },
    ],
  },
  {
    key: 'broken',
    title: '折线',
    options: [
      {
        label: '单折线',
        value: 'broken-single',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><polyline points="6,14 32,5 58,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', ''],
          color: '#111111',
          broken: [110, 88],
        },
      },
      {
        label: '双折线',
        value: 'broken-double',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><path d="M6 10 L20 10 L20 15 L44 15 L44 10 L58 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', ''],
          color: '#111111',
          broken2: [110, 66],
        },
      },
      {
        label: '折线箭头',
        value: 'broken-arrow',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><polyline points="6,14 30,5 52,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M50 6 L58 10 L50 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', 'arrow'],
          color: '#111111',
          broken: [110, 88],
        },
      },
    ],
  },
  {
    key: 'curve',
    title: '曲线',
    options: [
      {
        label: '二次曲线',
        value: 'curve-quadratic',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><path d="M6 14 Q32 2 58 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', ''],
          color: '#111111',
          curve: [110, 90],
        },
      },
      {
        label: '曲线箭头',
        value: 'curve-arrow',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><path d="M6 14 Q30 2 52 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M50 6 L58 10 L50 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 0],
          style: 'solid',
          points: ['', 'arrow'],
          color: '#111111',
          curve: [110, 90],
        },
      },
      {
        label: '三次曲线',
        value: 'curve-cubic',
        preview:
          '<svg viewBox="0 0 64 20" width="56" height="18"><path d="M6 14 C18 2 44 18 58 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
        data: {
          type: 'line',
          width: 2,
          start: [0, 0],
          end: [220, 90],
          style: 'solid',
          points: ['', ''],
          color: '#111111',
          cubic: [
            [70, 130],
            [150, -20],
          ],
        },
      },
    ],
  },
];

const handleClick = (option: LineOption) => {
  onAddLine(option.data);
  emit('close');
};

const onDragStart = (event: DragEvent, option: LineOption) => {
  startElementDrag(event, option.data, option.label);
};
</script>
