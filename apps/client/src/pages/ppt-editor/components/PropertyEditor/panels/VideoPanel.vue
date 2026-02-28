<template>
  <div class="space-y-2">
    <PanelSection title="视频来源">
      <template #icon>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      </template>
      <PropField
        label="视频地址"
        type="url"
        :model-value="element.src"
        placeholder="https://..."
        @change="onText('src', $event)"
      />
      <PropField
        label="封面图地址"
        type="url"
        :model-value="element.poster ?? ''"
        placeholder="https://..."
        @change="onText('poster', $event)"
      />
      <PropField
        label="扩展名"
        type="text"
        :model-value="element.ext ?? ''"
        placeholder="mp4"
        @change="onText('ext', $event)"
      />
    </PanelSection>

    <PanelSection title="播放设置">
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
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      </template>
      <ToggleField
        label="自动播放"
        :model-value="!!element.autoplay"
        @update:model-value="update('autoplay', $event)"
      />
    </PanelSection>
  </div>
</template>

<script setup lang="ts">
import PanelSection from '../components/PanelSection.vue';
import PropField from '../components/PropField.vue';
import ToggleField from '../components/ToggleField.vue';
import { useSlides } from '../../../models';
import type { PPTVideoElement } from '@/types';

const props = defineProps<{ element: PPTVideoElement }>();
const { updateElement } = useSlides();

const update = (key: string, value: unknown) => {
  updateElement({ id: props.element.id, props: { [key]: value } as never });
};

const onText = (key: string, event: Event) => {
  update(key, (event.target as HTMLInputElement).value.trim());
};
</script>
