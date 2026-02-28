<template>
  <PanelSection title="位置与大小">
    <template #icon>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <PropField
        label="X"
        type="number"
        :model-value="round(element.left)"
        unit="px"
        @change="onChange('left', $event)"
      />
      <PropField
        label="Y"
        type="number"
        :model-value="round(element.top)"
        unit="px"
        @change="onChange('top', $event)"
      />
      <PropField
        label="宽度"
        type="number"
        min="1"
        :model-value="round(element.width)"
        unit="px"
        @change="onChange('width', $event)"
      />
      <PropField
        label="高度"
        type="number"
        min="1"
        :model-value="round(element.height)"
        unit="px"
        @change="onChange('height', $event)"
      />
    </div>
    <PropField
      label="旋转角度"
      type="number"
      step="1"
      :model-value="round(element.rotate)"
      unit="°"
      @change="onChange('rotate', $event)"
    />
  </PanelSection>
</template>

<script setup lang="ts">
import PanelSection from '../components/PanelSection.vue';
import PropField from '../components/PropField.vue';
import { MIN_SIZE } from '@/constants';
import { useSlides } from '../../../models';
import type { PPTElement, PPTLineElement } from '@/types';

type BoxElement = Exclude<PPTElement, PPTLineElement>;

const props = defineProps<{ element: BoxElement }>();
const { updateElement } = useSlides();

const round = (v: number) => Math.round(v * 100) / 100;

const onChange = (key: 'left' | 'top' | 'width' | 'height' | 'rotate', event: Event) => {
  const raw = (event.target as HTMLInputElement).value;
  let value = Number(raw);
  if (!Number.isFinite(value)) return;

  const patch: Partial<BoxElement> = {};

  if (key === 'width' || key === 'height') {
    const minSize = MIN_SIZE[props.element.type] ?? 20;
    value = Math.max(minSize, value);
    patch[key] = value as never;

    if (
      'fixedRatio' in props.element &&
      props.element.fixedRatio &&
      props.element.width > 0 &&
      props.element.height > 0
    ) {
      if (key === 'width')
        patch.height = Math.max(minSize, (value * props.element.height) / props.element.width);
      else patch.width = Math.max(minSize, (value * props.element.width) / props.element.height);
    }
  } else {
    patch[key] = value as never;
  }

  updateElement({ id: props.element.id, props: patch });
};
</script>
