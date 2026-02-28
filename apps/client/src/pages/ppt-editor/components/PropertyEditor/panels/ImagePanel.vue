<template>
  <div class="space-y-2">
    <PanelSection title="图片来源">
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
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </template>
      <PropField
        label="图片地址"
        type="url"
        :model-value="element.src"
        placeholder="https://..."
        @change="onTextChange('src', $event)"
      />
      <ColorField
        label="颜色蒙版"
        :model-value="element.colorMask ?? ''"
        placeholder="无蒙版"
        @update:model-value="update('colorMask', $event || undefined)"
      />
    </PanelSection>

    <PanelSection title="外观">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="圆角"
          type="number"
          min="0"
          :model-value="element.radius ?? 0"
          unit="px"
          @change="onNumberChange('radius', $event, 0)"
        />
        <ToggleField
          label="锁定比例"
          :model-value="!!element.fixedRatio"
          @update:model-value="update('fixedRatio', $event)"
        />
      </div>
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

    <PanelSection title="滤镜">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <PropField
          label="模糊"
          type="number"
          min="0"
          max="20"
          :model-value="parseFilter(element.filters?.blur, 0)"
          unit="px"
          @change="onFilterChange('blur', $event, 'px')"
        />
        <PropField
          label="亮度"
          type="number"
          min="0"
          max="200"
          :model-value="parseFilter(element.filters?.brightness, 100)"
          unit="%"
          @change="onFilterChange('brightness', $event, '%')"
        />
        <PropField
          label="对比度"
          type="number"
          min="0"
          max="200"
          :model-value="parseFilter(element.filters?.contrast, 100)"
          unit="%"
          @change="onFilterChange('contrast', $event, '%')"
        />
        <PropField
          label="饱和度"
          type="number"
          min="0"
          max="200"
          :model-value="parseFilter(element.filters?.saturate, 100)"
          unit="%"
          @change="onFilterChange('saturate', $event, '%')"
        />
        <PropField
          label="灰度"
          type="number"
          min="0"
          max="100"
          :model-value="parseFilter(element.filters?.grayscale, 0)"
          unit="%"
          @change="onFilterChange('grayscale', $event, '%')"
        />
        <PropField
          label="不透明度"
          type="number"
          min="0"
          max="100"
          :model-value="parseFilter(element.filters?.opacity, 100)"
          unit="%"
          @change="onFilterChange('opacity', $event, '%')"
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
import type { PPTImageElement, PPTElementOutline, ImageElementFilters } from '@/types';

const props = defineProps<{ element: PPTImageElement }>();
const { updateElement } = useSlides();

const update = (key: string, value: unknown) => {
  updateElement({ id: props.element.id, props: { [key]: value } as never });
};

const onTextChange = (key: string, event: Event) => {
  update(key, (event.target as HTMLInputElement).value.trim());
};

const onNumberChange = (key: string, event: Event, min?: number) => {
  let v = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  if (min !== undefined) v = Math.max(min, v);
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

const parseFilter = (val: string | undefined, defaultVal: number) => {
  if (!val) return defaultVal;
  return parseFloat(val) || defaultVal;
};

const onFilterChange = (key: keyof ImageElementFilters, event: Event, suffix: string) => {
  const v = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  const filters: ImageElementFilters = { ...(props.element.filters ?? {}), [key]: `${v}${suffix}` };
  update('filters', filters);
};
</script>
