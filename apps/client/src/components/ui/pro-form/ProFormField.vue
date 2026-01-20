<script setup lang="ts">
import type { ProFormFieldProps } from './types';

import { useProFormField } from './hooks/useProFormField';

const props = defineProps<ProFormFieldProps>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [value: any];
}>();

const { Component, props: fieldProps } = useProFormField(props, {
  onUpdateModelValue: (val: any) => emit('update:modelValue', val),
  onChange: (val: any) => emit('change', val),
});
</script>

<template>
  <component :is="Component" v-bind="fieldProps" />
</template>
