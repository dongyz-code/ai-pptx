<template>
  <div class="text-content">
    <div class="content-title">选择文字类型</div>
    <div class="text-options">
      <div
        v-for="option in textOptions"
        :key="option.value"
        class="text-option"
        @click="handleSelect(option)"
      >
        <div class="text-preview" :style="{ fontSize: option.previewSize }">
          {{ option.preview }}
        </div>
        <div class="text-label">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TextOption {
  label: string;
  value: string;
  preview: string;
  previewSize: string;
  data: {
    content: string;
    fontSize: string;
    fontWeight: string;
  };
}

const textOptions: TextOption[] = [
  {
    label: '正文',
    value: 'body',
    preview: 'Aa',
    previewSize: '16px',
    data: {
      content: '正文内容',
      fontSize: '16px',
      fontWeight: 'normal',
    },
  },
  {
    label: '一级标题',
    value: 'heading1',
    preview: 'Aa',
    previewSize: '32px',
    data: {
      content: '一级标题',
      fontSize: '32px',
      fontWeight: 'bold',
    },
  },
  {
    label: '二级标题',
    value: 'heading2',
    preview: 'Aa',
    previewSize: '24px',
    data: {
      content: '二级标题',
      fontSize: '24px',
      fontWeight: 'bold',
    },
  },
  {
    label: '三级标题',
    value: 'heading3',
    preview: 'Aa',
    previewSize: '20px',
    data: {
      content: '三级标题',
      fontSize: '20px',
      fontWeight: '600',
    },
  },
  {
    label: '副标题',
    value: 'subtitle',
    preview: 'Aa',
    previewSize: '18px',
    data: {
      content: '副标题',
      fontSize: '18px',
      fontWeight: '500',
    },
  },
];

const emit = defineEmits<{
  select: [option: TextOption];
}>();

const handleSelect = (option: TextOption) => {
  emit('select', option);
};
</script>

<style scoped>
.text-content {
  min-width: 280px;
  padding: 12px;
}

.content-title {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 12px;
}

.text-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.text-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.text-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.text-preview {
  font-weight: 600;
  color: #333;
  line-height: 1;
}

.text-label {
  font-size: 13px;
  color: #666;
}
</style>
