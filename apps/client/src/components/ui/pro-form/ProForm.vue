<script setup lang="ts">
import { VIcon } from '..';
import { useProForm } from './hooks/useProForm';
import ProFormField from './ProFormField.vue';

import type { ProFormEmits, ProFormExpose, ProFormProps } from './types';

const props = withDefaults(defineProps<ProFormProps>(), {
  labelWidth: '120px',
  labelPosition: 'right',
  collapseToRows: 1,
  defaultCollapsed: true,
  showCollapse: true,
  submitText: '搜索',
  resetText: '重置',
  formProps: () => ({}),
});

const emit = defineEmits<ProFormEmits>();

const {
  defineField,
  collapsed,
  internalModel,
  displayFields,
  showCollapseButton,
  currentCols,
  errors,
  handleFieldChange,
  toggleCollapse,
  handleSubmit,
  handleReset,
  getSlotName,
  getColSpanStyle,
  validate,
  clearValidate,
  resetFields,
} = useProForm({ props, emit });

function updateFieldValue(key: string, value: any) {
  internalModel.value[key] = value;
}

defineExpose<ProFormExpose>({
  validate,
  clearValidate,
  resetFields,
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="pro-form">
    <div class="grid gap-4" :class="[`grid-cols-${currentCols}`]">
      <div v-for="field in displayFields" :key="field.key" :style="getColSpanStyle(field.colSpan)">
        <label class="mb-2 block font-medium">{{ field.label }}</label>

        <slot
          v-if="getSlotName(field)"
          :name="getSlotName(field)"
          :field="field"
          :model-value="internalModel[field.key]"
          :set-value="(val: any) => updateFieldValue(field.key, val)"
        />

        <ProFormField
          v-else
          :field="field"
          :model-value="internalModel[field.key]"
          @update:model-value="updateFieldValue(field.key, $event)"
          @change="handleFieldChange(field.key, $event)"
        />

        <small v-if="errors[field.key]" class="text-red-500">{{ errors[field.key] }}</small>
      </div>

      <div class="flex items-end justify-end gap-2">
        <slot
          name="actions"
          :submit="handleSubmit"
          :reset="handleReset"
          :collapsed="collapsed"
          :toggle="toggleCollapse"
        >
          <Button type="submit" severity="primary">{{ submitText }}</Button>
          <Button type="button" severity="secondary" @click="handleReset">{{ resetText }}</Button>
          <Button v-if="showCollapseButton" type="button" text severity="primary" @click="toggleCollapse">
            <span>{{ collapsed ? '展开' : '收起' }}</span>
            <VIcon
              icon="weui:arrow-filled"
              class="transition-transform duration-300"
              :class="{ 'rotate-90': collapsed, '-rotate-90': !collapsed }"
            />
          </Button>
        </slot>
      </div>
    </div>
  </form>
</template>

<style scoped>
.pro-form :deep(.p-inputtext),
.pro-form :deep(.p-inputnumber),
.pro-form :deep(.p-select),
.pro-form :deep(.p-cascadeselect),
.pro-form :deep(.p-datepicker) {
  width: 100%;
}
</style>
