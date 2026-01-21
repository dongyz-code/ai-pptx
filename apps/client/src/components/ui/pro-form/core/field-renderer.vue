<template>
  <UniversalRenderer
    :field="field"
    :model-value="modelValue"
    :error="error"
    :disabled="disabled"
    :readonly="readonly"
    @update:model-value="handleChange"
  />
</template>

<script setup lang="ts">
import UniversalRenderer from './universal-renderer.vue';
import type { FieldRendererProps } from '../types';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const handleChange = (value: any) => {
  emit('update:modelValue', value);
};
</script>
