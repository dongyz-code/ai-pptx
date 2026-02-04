<template>
  <div class="max-h-[560px] max-w-[560px] min-w-[420px] overflow-y-auto p-3">
    <div class="flex flex-col gap-[14px]">
      <div v-for="group in shapeGroups" :key="group.label" class="flex flex-col gap-2">
        <div class="px-1 pt-1 text-[13px] font-semibold text-[#444]">{{ group.label }}</div>
        <div class="grid grid-cols-4 gap-2">
          <div
            v-for="option in group.items"
            :key="option.value"
            class="flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-1.5 py-2.5 transition-all duration-200 hover:border-[#c9c9c9] hover:bg-[#fafafa] hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:cursor-grabbing"
            draggable="true"
            @dragstart="($event: DragEvent) => handleDragStart($event, option)"
            @click="handleSelect(option)"
          >
            <div
              class="flex h-[40px] w-[52px] items-center justify-center"
              v-html="option.preview"
            ></div>
            <div class="text-center text-[12px] text-[#666]">{{ option.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PPTShapeElement, PPTElementOutline } from '@/types';

type ShapeData = Pick<
  PPTShapeElement,
  'viewBox' | 'path' | 'fill' | 'fixedRatio' | 'pathFormula' | 'outline'
> & {
  width?: number;
  height?: number;
};

interface ShapeOption {
  label: string;
  value: string;
  preview: string;
  data: ShapeData;
}

interface ShapeGroup {
  label: string;
  items: ShapeOption[];
}

const baseFill = '#FFF';
const baseOutline: PPTElementOutline = {
  width: 1.5,
  color: '#111111',
  style: 'solid',
};

const createPreview = (path: string, viewBox: [number, number] = [200, 200]) => {
  return `<svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="${baseFill}" stroke="${baseOutline.color}" stroke-width="${baseOutline.width}" vector-effect="non-scaling-stroke"/></svg>`;
};

const createShape = (
  label: string,
  value: string,
  path: string,
  size: [number, number],
  options: Partial<ShapeData> = {}
): ShapeOption => {
  return {
    label,
    value,
    preview: createPreview(path),
    data: {
      viewBox: [200, 200],
      path,
      fill: baseFill,
      outline: { ...baseOutline },
      width: size[0],
      height: size[1],
      fixedRatio: options.fixedRatio ?? false,
      pathFormula: options.pathFormula,
    },
  };
};

const shapeGroups: ShapeGroup[] = [
  {
    label: '矩形',
    items: [
      createShape('矩形', 'rect', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [140, 90]),
      createShape(
        '圆角矩形',
        'roundRect',
        'M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 Z',
        [140, 90]
      ),
      createShape(
        '切角矩形',
        'cutRect',
        'M 20 0 L 180 0 L 200 20 L 200 180 L 180 200 L 20 200 L 0 180 L 0 20 Z',
        [140, 90]
      ),
      createShape('正方形', 'square', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [120, 120], {
        fixedRatio: true,
      }),
    ],
  },
  {
    label: '基础形状',
    items: [
      createShape(
        '圆形',
        'circle',
        'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z',
        [120, 120],
        { fixedRatio: true }
      ),
      createShape(
        '椭圆',
        'ellipse',
        'M 100 20 A 90 80 0 1 1 100 180 A 90 80 0 1 1 100 20 Z',
        [150, 100]
      ),
      createShape('三角形', 'triangle', 'M 100 0 L 200 200 L 0 200 Z', [120, 110], {
        fixedRatio: true,
      }),
      createShape('菱形', 'diamond', 'M 100 0 L 200 100 L 100 200 L 0 100 Z', [120, 120], {
        fixedRatio: true,
      }),
      createShape(
        '五边形',
        'pentagon',
        'M 100 0 L 190 70 L 160 200 L 40 200 L 10 70 Z',
        [130, 120],
        { fixedRatio: true }
      ),
      createShape(
        '六边形',
        'hexagon',
        'M 50 0 L 150 0 L 200 100 L 150 200 L 50 200 L 0 100 Z',
        [140, 120],
        { fixedRatio: true }
      ),
      createShape(
        '五角星',
        'star',
        'M 100 0 L 120 70 L 190 80 L 130 130 L 150 200 L 100 160 L 50 200 L 70 130 L 10 80 L 80 70 Z',
        [140, 130],
        { fixedRatio: true }
      ),
    ],
  },
  {
    label: '箭头',
    items: [
      createShape(
        '右箭头',
        'arrowRight',
        'M 0 60 L 120 60 L 120 20 L 200 100 L 120 180 L 120 140 L 0 140 Z',
        [150, 100]
      ),
      createShape(
        '左箭头',
        'arrowLeft',
        'M 200 60 L 80 60 L 80 20 L 0 100 L 80 180 L 80 140 L 200 140 Z',
        [150, 100]
      ),
      createShape(
        '上箭头',
        'arrowUp',
        'M 100 0 L 200 80 L 140 80 L 140 200 L 60 200 L 60 80 L 0 80 Z',
        [120, 150]
      ),
      createShape(
        '下箭头',
        'arrowDown',
        'M 60 0 L 140 0 L 140 120 L 200 120 L 100 200 L 0 120 L 60 120 Z',
        [120, 150]
      ),
      createShape(
        '左右双箭头',
        'doubleArrowH',
        'M 0 100 L 60 40 L 60 80 L 140 80 L 140 40 L 200 100 L 140 160 L 140 120 L 60 120 L 60 160 Z',
        [160, 100]
      ),
    ],
  },
  {
    label: '公式形状',
    items: [
      createShape(
        '加号',
        'plus',
        'M 80 0 L 120 0 L 120 80 L 200 80 L 200 120 L 120 120 L 120 200 L 80 200 L 80 120 L 0 120 L 0 80 L 80 80 Z',
        [120, 120],
        { fixedRatio: true }
      ),
      createShape('减号', 'minus', 'M 0 80 L 200 80 L 200 120 L 0 120 Z', [140, 80]),
      createShape(
        '乘号',
        'multiply',
        'M 30 0 L 100 70 L 170 0 L 200 30 L 130 100 L 200 170 L 170 200 L 100 130 L 30 200 L 0 170 L 70 100 L 0 30 Z',
        [120, 120],
        { fixedRatio: true }
      ),
      createShape(
        '除号',
        'divide',
        'M 90 40 A 10 10 0 1 1 110 40 A 10 10 0 1 1 90 40 Z M 0 90 L 200 90 L 200 110 L 0 110 Z M 90 160 A 10 10 0 1 1 110 160 A 10 10 0 1 1 90 160 Z',
        [120, 140],
        { fixedRatio: true }
      ),
      createShape(
        '等号',
        'equal',
        'M 0 60 L 200 60 L 200 90 L 0 90 Z M 0 110 L 200 110 L 200 140 L 0 140 Z',
        [140, 100]
      ),
    ],
  },
  {
    label: '流程图',
    items: [
      createShape('流程', 'process', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [150, 90]),
      createShape(
        '终止',
        'terminator',
        'M 30 0 L 170 0 Q 200 0 200 30 L 200 170 Q 200 200 170 200 L 30 200 Q 0 200 0 170 L 0 30 Q 0 0 30 0 Z',
        [150, 90]
      ),
      createShape('决策', 'decision', 'M 100 0 L 200 100 L 100 200 L 0 100 Z', [120, 120], {
        fixedRatio: true,
      }),
      createShape('数据', 'data', 'M 40 0 L 200 0 L 160 200 L 0 200 Z', [150, 90]),
      createShape(
        '文档',
        'document',
        'M 0 0 L 200 0 L 200 160 C 160 140 120 180 80 160 C 40 140 20 180 0 160 Z',
        [150, 100]
      ),
    ],
  },
  {
    label: '标注',
    items: [
      createShape(
        '气泡',
        'callout',
        'M 0 0 L 200 0 L 200 150 L 120 150 L 100 200 L 80 150 L 0 150 Z',
        [160, 110]
      ),
      createShape(
        '圆角气泡',
        'roundCallout',
        'M 20 0 L 180 0 Q 200 0 200 20 L 200 130 Q 200 150 180 150 L 120 150 L 100 200 L 80 150 L 20 150 Q 0 150 0 130 L 0 20 Q 0 0 20 0 Z',
        [160, 110]
      ),
      createShape(
        '左侧标注',
        'calloutLeft',
        'M 0 40 L 40 40 L 40 0 L 200 0 L 200 160 L 40 160 L 40 120 L 0 120 Z',
        [160, 110]
      ),
    ],
  },
];

const emit = defineEmits<{
  select: [option: ShapeOption];
}>();

const handleSelect = (option: ShapeOption) => {
  emit('select', option);
};

const handleDragStart = (event: DragEvent, option: ShapeOption) => {
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/x-ppt-shape', JSON.stringify(option.data));
  event.dataTransfer.setData('text/plain', option.label);
};
</script>
