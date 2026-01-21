<template>
  <!-- 普通组件（非 group） -->
  <component
    v-if="!config.isGroup"
    :is="config.component"
    :model-value="modelValue"
    :placeholder="field.placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :options="needsOptions ? resolvedOptions : undefined"
    :loading="needsOptions ? loading : undefined"
    v-bind="mergedProps"
    @update:model-value="handleChange"
  />

  <!-- Radio Group -->
  <div v-else-if="field.valueType === 'radio'" class="flex gap-3">
    <div v-for="option in resolvedOptions" :key="option.value" class="flex items-center">
      <component
        :is="config.component"
        :model-value="modelValue"
        :value="option.value"
        :disabled="disabled || option.disabled"
        :input-id="`${field.key}-${option.value}`"
        v-bind="field.props"
        @update:model-value="handleChange"
      />
      <label :for="`${field.key}-${option.value}`" class="ml-2 cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>

  <!-- Checkbox Group -->
  <div v-else-if="field.valueType === 'checkboxGroup'" class="flex flex-col gap-2">
    <div v-for="option in resolvedOptions" :key="option.value" class="flex items-center">
      <component
        :is="config.component"
        :model-value="isChecked(option.value)"
        :disabled="disabled || option.disabled"
        :input-id="`${field.key}-${option.value}`"
        v-bind="field.props"
        @update:model-value="(checked: boolean) => handleCheckboxGroupChange(option.value, checked)"
      />
      <label :for="`${field.key}-${option.value}`" class="ml-2 cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getComponentConfig } from './component-map';
import { useOptionsResolver } from './use-options-resolver';
import type { FieldRendererProps } from '../types';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

// 获取组件配置
const config = computed(() => getComponentConfig(props.field.valueType));

// 是否需要 options
const needsOptions = computed(() => config.value.needsOptions);

// 解析 options - 直接传递 field.options，让 resolver 内部判断
const { options: resolvedOptions, loading } = useOptionsResolver(props.field.options);

// 合并 props（默认 props + 用户 props）
const mergedProps = computed(() => ({
  ...config.value.defaultProps,
  ...props.field.props,
}));

// 处理值变化
const handleChange = (value: any) => {
  emit('update:modelValue', value);
};

// CheckboxGroup: 判断是否选中
const isChecked = (value: any) => {
  const currentValue = props.modelValue || [];
  return Array.isArray(currentValue) && currentValue.includes(value);
};

// CheckboxGroup: 处理变化
const handleCheckboxGroupChange = (value: any, checked: boolean) => {
  const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];

  if (checked) {
    if (!currentValue.includes(value)) {
      currentValue.push(value);
    }
  } else {
    const index = currentValue.indexOf(value);
    if (index > -1) {
      currentValue.splice(index, 1);
    }
  }

  emit('update:modelValue', currentValue);
};
</script>
