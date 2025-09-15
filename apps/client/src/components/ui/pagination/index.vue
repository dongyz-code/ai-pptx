<template>
  <Paginator
    :rows="pageData.pageSize"
    :rowsPerPageOptions="pageData.pageSizes"
    :total-records="pageData.total"
    @update:rows="onUpdateRows"
    @update:first="onUpdateFirst"
  ></Paginator>
</template>

<script setup lang="ts">
import Paginator from 'primevue/paginator';

import type { PaginationData } from '@/hooks';

const props = defineProps<{
  pageData: PaginationData;
}>();

const emits = defineEmits<{
  'update:modelValue': [PaginationData];
  onChange: [];
}>();

const onUpdateFirst = (current: number) => {
  emits('update:modelValue', {
    ...props.pageData,
    current: current,
  });
  emits('onChange');
};

const onUpdateRows = (pageSize: number) => {
  emits('update:modelValue', {
    ...props.pageData,
    pageSize,
  });
  emits('onChange');
};
</script>

<style lang="scss" scoped></style>
