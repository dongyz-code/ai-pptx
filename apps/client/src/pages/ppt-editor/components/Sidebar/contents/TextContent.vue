<template>
  <div class="p-1">
    <div class="flex flex-col">
      <div
        v-for="option in textOptions"
        :key="option.value"
        class="flex cursor-pointer gap-2 rounded-md p-2 pr-12 hover:bg-gray-100"
        :style="{ fontSize: option.previewSize }"
        @click="handleClick(option)"
      >
        <div>
          <v-icon :icon="option.icon" />
        </div>
        <div>{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAction } from '../useAction';
import { useDragCreate } from '@/pages/ppt-editor/hooks';
import type { PPTTextElement } from '@/types';
import { VIcon, type IconName } from '@/components/ui';

interface TextOption {
  label: string;
  value: string;
  icon: IconName;
  previewSize: string;
  data: Partial<PPTTextElement>;
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const textOptions: TextOption[] = [
  {
    label: '正文',
    value: 'body',
    icon: 'solar:text-bold',
    previewSize: '14px',
    data: {
      content: '<p><span style="font-size: 14px;">正文内容</span></p>',
    },
  },
  {
    label: '标题1',
    value: 'heading1',
    icon: 'mynaui:heading-one',
    previewSize: '18px',
    data: {
      content: '<p><strong><span style="font-size: 32px;">标题1</span></strong></p>',
    },
  },
  {
    label: '标题2',
    value: 'heading2',
    icon: 'mynaui:heading-two',
    previewSize: '17px',
    data: {
      content: '<p><strong><span style="font-size: 28px;">标题2</span></strong></p>',
    },
  },
  {
    label: '标题3',
    value: 'heading3',
    icon: 'mynaui:heading-three',
    previewSize: '16px',
    data: {
      content: '<p><strong><span style="font-size: 24px;">标题3</span></strong></p>',
    },
  },
  {
    label: '标题4',
    value: 'heading4',
    icon: 'mynaui:heading-four',
    previewSize: '15px',
    data: {
      content: '<p><strong><span style="font-size: 18px;">标题4</span></strong></p>',
    },
  },
  {
    label: '标题5',
    value: 'heading5',
    icon: 'mynaui:heading-five',
    previewSize: '14px',
    data: {
      content: '<p><strong><span style="font-size: 16px;">标题5</span></strong></p>',
    },
  },
  {
    label: '标注',
    value: 'caption',
    icon: 'solar:text-bold',
    previewSize: '12px',
    data: {
      content: '<p><span style="font-size: 12px;">标注</span></p>',
    },
  },
];

const { onAddText } = useAction();

const handleClick = (option: TextOption) => {
  onAddText(option.data);
  emit('close');
};
</script>
