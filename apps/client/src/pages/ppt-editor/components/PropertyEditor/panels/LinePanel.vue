<template>
  <div class="space-y-2">
    <PanelSection title="线条样式">
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
      <ColorField
        label="线条颜色"
        :model-value="element.color"
        @update:model-value="update('color', $event)"
      />
      <div class="flex flex-col gap-[5px]">
        <span class="text-[11px] font-medium text-black/45">线条样式</span>
        <SegmentedControl
          :model-value="element.style"
          :options="[
            { value: 'solid', label: '实线' },
            { value: 'dashed', label: '虚线' },
            { value: 'dotted', label: '点线' },
          ]"
          @update:model-value="update('style', $event)"
        />
      </div>
    </PanelSection>

    <PanelSection title="端点样式">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="12" r="3" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-[5px]">
          <span class="text-[11px] font-medium text-black/45">起点</span>
          <SegmentedControl
            :model-value="element.points[0]"
            :options="[
              { value: '', label: '无' },
              { value: 'arrow', label: '箭头' },
              { value: 'dot', label: '圆点' },
            ]"
            @update:model-value="onPoint(0, $event)"
          />
        </div>
        <div class="flex flex-col gap-[5px]">
          <span class="text-[11px] font-medium text-black/45">终点</span>
          <SegmentedControl
            :model-value="element.points[1]"
            :options="[
              { value: '', label: '无' },
              { value: 'arrow', label: '箭头' },
              { value: 'dot', label: '圆点' },
            ]"
            @update:model-value="onPoint(1, $event)"
          />
        </div>
      </div>
    </PanelSection>

    <PanelSection title="坐标信息">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 3l7 7M3 21l7-7M21 3l-7 7M21 21l-7-7" />
        </svg>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="起点 X"
          type="number"
          :model-value="round(element.start[0])"
          @change="onCoord('start', 0, $event)"
        />
        <PropField
          label="起点 Y"
          type="number"
          :model-value="round(element.start[1])"
          @change="onCoord('start', 1, $event)"
        />
        <PropField
          label="终点 X"
          type="number"
          :model-value="round(element.end[0])"
          @change="onCoord('end', 0, $event)"
        />
        <PropField
          label="终点 Y"
          type="number"
          :model-value="round(element.end[1])"
          @change="onCoord('end', 1, $event)"
        />
      </div>
      <div class="text-[11px] leading-normal text-black/40">
        提示：建议直接拖动画布中的控制点调整线条形态
      </div>
    </PanelSection>
  </div>
</template>

<script setup lang="ts">
import PanelSection from '../components/PanelSection.vue';
import PropField from '../components/PropField.vue';
import ColorField from '../components/ColorField.vue';
import SegmentedControl from '../components/SegmentedControl.vue';
import { useSlides } from '../../../models';
import type { PPTLineElement, LinePoint } from '@/types';

const props = defineProps<{ element: PPTLineElement }>();
const { updateElement } = useSlides();

const update = (key: string, value: unknown) => {
  updateElement({ id: props.element.id, props: { [key]: value } as never });
};

const round = (v: number) => Math.round(v * 100) / 100;

const onPoint = (index: 0 | 1, value: string) => {
  const points = [...props.element.points] as [LinePoint, LinePoint];
  points[index] = value as LinePoint;
  update('points', points);
};

const onCoord = (key: 'start' | 'end', index: 0 | 1, event: Event) => {
  const v = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  const coord = [...props.element[key]] as [number, number];
  coord[index] = v;
  update(key, coord);
};
</script>
