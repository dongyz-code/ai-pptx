<template>
  <div class="space-y-2">
    <PanelSection title="填充">
      <template #icon>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 0 0 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"
          />
          <path d="M0 20h24v4H0z" opacity=".36" />
        </svg>
      </template>
      <ColorField
        label="填充颜色"
        :model-value="element.fill"
        @update:model-value="update('fill', $event)"
      />
      <PropField
        label="不透明度"
        type="number"
        step="0.05"
        min="0"
        max="1"
        :model-value="element.opacity ?? 1"
        @change="onNumberChange('opacity', $event, 0, 1)"
      />
      <div class="grid grid-cols-2 gap-2">
        <ToggleField
          label="水平翻转"
          :model-value="!!element.flipH"
          @update:model-value="update('flipH', $event)"
        />
        <ToggleField
          label="垂直翻转"
          :model-value="!!element.flipV"
          @update:model-value="update('flipV', $event)"
        />
      </div>
    </PanelSection>

    <PanelSection title="边框">
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
        </svg>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="边框宽度"
          type="number"
          min="0"
          :model-value="element.outline?.width ?? 0"
          unit="px"
          @change="onOutlineChange('width', $event)"
        />
        <ColorField
          label="边框颜色"
          :model-value="element.outline?.color ?? '#000000'"
          @update:model-value="onOutlineUpdate('color', $event)"
        />
      </div>
      <div class="flex flex-col gap-[5px]">
        <span class="text-[11px] font-medium text-black/45">边框样式</span>
        <SegmentedControl
          :model-value="element.outline?.style ?? 'solid'"
          :options="[
            { value: 'solid', label: '实线' },
            { value: 'dashed', label: '虚线' },
            { value: 'dotted', label: '点线' },
          ]"
          @update:model-value="onOutlineUpdate('style', $event)"
        />
      </div>
    </PanelSection>

    <PanelSection v-if="element.text" title="形状内文本">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </template>
      <ColorField
        label="文字颜色"
        :model-value="element.text.defaultColor"
        @update:model-value="onTextProp('defaultColor', $event)"
      />
      <div class="flex flex-col gap-[5px]">
        <span class="text-[11px] font-medium text-black/45">垂直对齐</span>
        <SegmentedControl
          :model-value="element.text.align"
          :options="[
            { value: 'top', label: '顶部' },
            { value: 'middle', label: '居中' },
            { value: 'bottom', label: '底部' },
          ]"
          @update:model-value="onTextProp('align', $event)"
        />
      </div>
    </PanelSection>
  </div>
</template>

<script setup lang="ts">
import PanelSection from '../components/PanelSection.vue';
import PropField from '../components/PropField.vue';
import ColorField from '../components/ColorField.vue';
import ToggleField from '../components/ToggleField.vue';
import SegmentedControl from '../components/SegmentedControl.vue';
import { useSlides } from '../../../models';
import type { PPTShapeElement, PPTElementOutline } from '@/types';

const props = defineProps<{ element: PPTShapeElement }>();
const { updateElement } = useSlides();

const update = (key: string, value: unknown) => {
  updateElement({ id: props.element.id, props: { [key]: value } as never });
};

const onNumberChange = (key: string, event: Event, min?: number, max?: number) => {
  let v = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  update(key, v);
};

const onOutlineChange = (key: keyof PPTElementOutline, event: Event) => {
  const v =
    key === 'width'
      ? Number((event.target as HTMLInputElement).value)
      : (event.target as HTMLInputElement).value;
  onOutlineUpdate(key, v);
};

const onOutlineUpdate = (key: keyof PPTElementOutline, value: unknown) => {
  const outline = { ...(props.element.outline ?? {}), [key]: value } as PPTElementOutline;
  update('outline', outline);
};

const onTextProp = (key: string, value: unknown) => {
  if (!props.element.text) return;
  update('text', { ...props.element.text, [key]: value });
};
</script>
