<template>
  <div
    class="mb-6"
    :class="{
      'has-error': !!error,
      'flex flex-col': labelPosition === 'top',
      'flex flex-row items-start': labelPosition === 'left',
    }"
  >
    <!-- Label 区域 -->
    <div
      v-if="field.label"
      class="flex items-center font-medium text-gray-700"
      :class="{
        'mb-2': labelPosition === 'top',
        'flex-shrink-0 pt-2 mr-4 text-right': labelPosition === 'left',
      }"
      :style="labelPosition === 'left' && labelWidth ? { width: labelWidth } : undefined"
    >
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
    <div
      class="w-full"
      :class="{ 'flex-1 min-w-0': labelPosition === 'left' }"
    >
      <FieldRenderer
        :field="field"
        :model-value="modelValue"
        :error="error"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="handleChange"
      />

      <!-- 错误信息（在 left 布局时显示在控制区域内） -->
      <div v-if="error && labelPosition === 'left'" class="mt-1">
        <small class="text-red-500">{{ error }}</small>
      </div>
    </div>

    <!-- 错误信息（在 top 布局时显示在外层） -->
    <div v-if="error && labelPosition === 'top'" class="mt-1">
      <small class="text-red-500">{{ error }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FieldRenderer from './core/field-renderer.vue';
import type { ProFormFieldSchema, LabelPosition } from './types';

interface ProFormItemProps {
  field: ProFormFieldSchema;
  modelValue: any;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  labelPosition?: LabelPosition;
  labelWidth?: string;
}

const props = withDefaults(defineProps<ProFormItemProps>(), {
  labelPosition: 'top',
  labelWidth: '120px',
});

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
/* 错误状态 - 使用 :deep() 来影响子组件 */
.has-error :deep(input),
.has-error :deep(textarea),
.has-error :deep(.p-select),
.has-error :deep(.p-multiselect) {
  border-color: #ef4444;
}
</style>
