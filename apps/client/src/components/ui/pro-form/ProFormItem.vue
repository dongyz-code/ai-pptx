<template>
  <div class="pro-form-item" :class="{ 'has-error': !!error }">
    <!-- Label 区域 -->
    <div v-if="field.label" class="pro-form-item__label">
      <label :for="field.key">
        {{ field.label }}
      </label>

      <!-- Tooltip -->
      <i
        v-if="field.tooltip"
        v-tooltip.top="tooltipContent"
        class="pi pi-question-circle ml-1 text-gray-400 cursor-help"
      />
    </div>

    <!-- 字段渲染区域 -->
    <div class="pro-form-item__control">
      <FieldRenderer
        :field="field"
        :model-value="modelValue"
        :error="error"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="handleChange"
      />
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="pro-form-item__error">
      <small class="text-red-500">{{ error }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FieldRenderer from './core/field-renderer.vue';
import type { ProFormFieldSchema } from './types';

interface ProFormItemProps {
  field: ProFormFieldSchema;
  modelValue: any;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
}

const props = defineProps<ProFormItemProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'blur'): void;
}>();

// 处理 tooltip 内容（支持 string 和 VNode）
const tooltipContent = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return props.field.tooltip;
  }
  // 如果是 VNode，返回字符串形式（或者可以不显示）
  return '';
});

const handleChange = (value: any) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.pro-form-item {
  margin-bottom: 1.5rem;
}

.pro-form-item__label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.pro-form-item__control {
  width: 100%;
}

.pro-form-item__error {
  margin-top: 0.25rem;
}

.pro-form-item.has-error .pro-form-item__control :deep(input),
.pro-form-item.has-error .pro-form-item__control :deep(textarea),
.pro-form-item.has-error .pro-form-item__control :deep(.p-select),
.pro-form-item.has-error .pro-form-item__control :deep(.p-multiselect) {
  border-color: #ef4444;
}
</style>
