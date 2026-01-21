<template>
  <form class="pro-form" @submit.prevent="handleSubmit">
    <!-- 表单字段 -->
    <div
      class="pro-form__fields"
      :class="{
        'grid gap-4': grid,
        [`grid-cols-${gridProps?.cols || 2}`]: grid,
      }"
    >
      <div
        v-for="field in visibleFields"
        :key="field.key"
        :class="getFieldColClass(field)"
      >
        <ProFormItem
          :field="field"
          :model-value="formData[field.key]"
          :error="errors[field.key]"
          :disabled="disabled"
          :readonly="readonly"
          @update:model-value="(value) => handleFieldChange(field.key, value)"
          @blur="() => handleFieldBlur(field.key)"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="pro-form__actions">
      <slot name="actions" :submit="handleSubmit" :reset="handleReset">
        <Button type="submit" label="提交" />
        <Button type="button" label="重置" severity="secondary" @click="handleReset" />
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Button from 'primevue/button';
import ProFormItem from './ProFormItem.vue';
import { useZodValidator } from './core/use-zod-validator';
import type { ProFormProps, ProFormFieldSchema, ProFormInstance, ValidationResult } from './types';

const props = withDefaults(defineProps<ProFormProps>(), {
  layout: 'vertical',
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
const { errors, validateField, validateForm, clearValidate, setFieldError } = useZodValidator({
  fields: props.schema,
  formData,
});

// 可见字段
const visibleFields = computed(() => {
  return props.schema.filter((field) => !field.hideInForm);
});

// 获取字段列类名
const getFieldColClass = (field: ProFormFieldSchema) => {
  if (!props.grid || !field.colProps) return '';

  const classes: string[] = [];
  if (field.colProps.xs) classes.push(`col-span-${field.colProps.xs}`);
  if (field.colProps.sm) classes.push(`sm:col-span-${field.colProps.sm}`);
  if (field.colProps.md) classes.push(`md:col-span-${field.colProps.md}`);
  if (field.colProps.lg) classes.push(`lg:col-span-${field.colProps.lg}`);
  if (field.colProps.xl) classes.push(`xl:col-span-${field.colProps.xl}`);

  return classes.join(' ');
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

<style scoped>
.pro-form {
  width: 100%;
}

.pro-form__fields {
  margin-bottom: 1.5rem;
}

.pro-form__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
