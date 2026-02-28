<template>
  <div class="space-y-2">
    <PanelSection title="文本样式">
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
        label="默认颜色"
        :model-value="element.defaultColor"
        @update:model-value="update('defaultColor', $event)"
      />
      <PropField
        label="默认字体"
        type="text"
        :model-value="element.defaultFontName"
        placeholder="e.g. Arial"
        @change="onTextChange('defaultFontName', $event)"
      />

      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="行高"
          type="number"
          step="0.1"
          min="0.5"
          :model-value="element.lineHeight ?? 1.5"
          @change="onNumberChange('lineHeight', $event, 0.5)"
        />
        <PropField
          label="字间距"
          type="number"
          step="1"
          :model-value="element.wordSpace ?? 0"
          unit="px"
          @change="onNumberChange('wordSpace', $event)"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="不透明度"
          type="number"
          step="0.05"
          min="0"
          max="1"
          :model-value="element.opacity ?? 1"
          @change="onNumberChange('opacity', $event, 0, 1)"
        />
        <PropField
          label="段间距"
          type="number"
          step="1"
          :model-value="element.paragraphSpace ?? 5"
          unit="px"
          @change="onNumberChange('paragraphSpace', $event, 0)"
        />
      </div>

      <ToggleField
        label="竖向文本"
        :model-value="!!element.vertical"
        @update:model-value="update('vertical', $event)"
      />
    </PanelSection>

    <PanelSection title="填充与边框">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </template>
      <ColorField
        label="填充色"
        :model-value="element.fill ?? ''"
        placeholder="无填充"
        @update:model-value="update('fill', $event || undefined)"
      />

      <div class="grid grid-cols-3 gap-2">
        <PropField
          label="边框宽度"
          type="number"
          min="0"
          :model-value="element.outline?.width ?? 0"
          unit="px"
          @change="onOutlineChange('width', $event)"
        />
        <PropField
          label="边框颜色"
          type="color"
          :model-value="element.outline?.color ?? '#000000'"
          @change="onOutlineColorChange"
        />
        <div class="flex flex-col gap-[5px]">
          <span class="text-[11px] font-medium text-black/45">边框样式</span>
          <SegmentedControl
            :model-value="element.outline?.style ?? 'solid'"
            :options="[
              { value: 'solid', label: '实' },
              { value: 'dashed', label: '虚' },
              { value: 'dotted', label: '点' },
            ]"
            @update:model-value="onOutlineChange('style', $event)"
          />
        </div>
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
import type { PPTTextElement, PPTElementOutline } from '@/types';

const props = defineProps<{ element: PPTTextElement }>();
const { updateElement } = useSlides();

const update = (key: string, value: unknown) => {
  updateElement({ id: props.element.id, props: { [key]: value } as never });
};

const onTextChange = (key: string, event: Event) => {
  update(key, (event.target as HTMLInputElement).value);
};

const onNumberChange = (key: string, event: Event, min?: number, max?: number) => {
  let v = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  update(key, v);
};

const onOutlineChange = (key: keyof PPTElementOutline, value: unknown) => {
  const outline = { ...(props.element.outline ?? {}), [key]: value } as PPTElementOutline;
  update('outline', outline);
};

const onOutlineColorChange = (event: Event) => {
  onOutlineChange('color', (event.target as HTMLInputElement).value);
};
</script>
