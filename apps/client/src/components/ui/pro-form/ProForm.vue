<template>
  <form class="w-full" @submit.prevent="handleSubmit">
    <!-- 表单字段 -->
    <div
      class="mb-6"
      :class="{
        'flex flex-wrap': grid,
      }"
      :style="grid ? gridStyle : undefined"
    >
      <div
        v-for="field in visibleFields"
        :key="field.key"
        :class="getFieldColClass(field)"
        :style="getFieldColStyle(field)"
      >
        <ProFormItem
          :field="field"
          :model-value="formData[field.key]"
          :error="errors[field.key]"
          :disabled="disabled"
          :readonly="readonly"
          :label-position="labelPosition"
          :label-width="labelWidth"
          @update:model-value="(value) => handleFieldChange(field.key, value)"
          @blur="() => handleFieldBlur(field.key)"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end gap-3">
      <slot name="actions" :submit="handleSubmit" :reset="handleReset">
        <Button type="submit" label="提交" />
        <Button type="button" label="重置" severity="secondary" @click="handleReset" />
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, HTMLAttributes } from 'vue';
import Button from 'primevue/button';
import ProFormItem from './ProFormItem.vue';
import { useZodValidator } from './core/use-zod-validator';
import type { ProFormProps, ProFormFieldSchema, ProFormInstance, ValidationResult } from './types';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelPosition: 'top',
  labelWidth: '120px',
  grid: false,
  readonly: false,
  disabled: false,
  gridProps: () => ({ cols: 2, gutter: 16 }),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit', values: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'valuesChange', changedValues: Record<string, any>, allValues: Record<string, any>): void;
}>();

// 表单数据
const formData = ref<Record<string, any>>({});

// 初始化表单数据
const initFormData = () => {
  const initialData: Record<string, any> = {};
  props.schema.forEach((field) => {
    if (field.value !== undefined) {
      initialData[field.key] = field.value;
    }
  });
  formData.value = { ...initialData, ...props.modelValue };
};

onMounted(() => {
  initFormData();
});

// 监听外部 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      formData.value = { ...formData.value, ...newValue };
    }
  },
  { deep: true }
);

// 校验器
const { errors, validateField, validateForm, clearValidate } = useZodValidator({
  fields: props.schema,
  formData,
});

// 可见字段
const visibleFields = computed(() => {
  return props.schema.filter((field) => !field.hideInForm);
});

// Grid 样式
const gridStyle = computed(() => {
  if (!props.grid) return undefined;
  const gutter = props.gridProps?.gutter || 16;
  return {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: `-${gutter / 2}px`,
    marginRight: `-${gutter / 2}px`,
  } as HTMLAttributes['style'];
});

// 获取字段列类名
const getFieldColClass = (field: ProFormFieldSchema) => {
  if (!props.grid) return '';
  return 'box-border';
};

// 获取字段列样式（24栅格系统）
const getFieldColStyle = (field: ProFormFieldSchema) => {
  if (!props.grid) return undefined;

  const gutter = props.gridProps?.gutter || 16;
  const span = field.colProps?.span || 24;

  // 计算百分比宽度
  const width = `${(span / 24) * 100}%`;

  return {
    width,
    paddingLeft: `${gutter / 2}px`,
    paddingRight: `${gutter / 2}px`,
    marginBottom: `${gutter}px`,
  };
};

// 字段值变化
const handleFieldChange = (key: string, value: any) => {
  formData.value[key] = value;
  emit('update:modelValue', formData.value);
  emit('valuesChange', { [key]: value }, formData.value);
};

// 字段失焦校验
const handleFieldBlur = async (key: string) => {
  await validateField(key);
};

// 提交表单
const handleSubmit = async () => {
  const result = await validateForm();
  if (result.valid) {
    emit('submit', formData.value);
  }
};

// 重置表单
const handleReset = () => {
  initFormData();
  clearValidate();
  emit('reset');
  emit('update:modelValue', formData.value);
};

// 暴露实例方法
const validate = async (): Promise<ValidationResult> => {
  return await validateForm();
};

const validateFieldMethod = async (key: string): Promise<boolean> => {
  return await validateField(key);
};

const resetFields = () => {
  handleReset();
};

const getFieldValue = (key: string) => {
  return formData.value[key];
};

const setFieldValue = (key: string, value: any) => {
  formData.value[key] = value;
  emit('update:modelValue', formData.value);
};

const getFieldsValue = () => {
  return { ...formData.value };
};

const setFieldsValue = (values: Record<string, any>) => {
  formData.value = { ...formData.value, ...values };
  emit('update:modelValue', formData.value);
};

defineExpose<ProFormInstance>({
  validate,
  validateField: validateFieldMethod,
  clearValidate,
  resetFields,
  getFieldValue,
  setFieldValue,
  getFieldsValue,
  setFieldsValue,
});
</script>
