<template>
  <div class="min-w-[340px] p-3">
    <div class="mb-3 border-b border-[#e5e5e5] px-3 py-2 text-sm font-semibold text-[#333]">选择图表类型</div>
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="option in chartOptions"
        :key="option.value"
        class="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-3 py-4 transition-all duration-200 hover:border-[#4A90E2] hover:bg-[#f0f7ff] hover:shadow-[0_2px_8px_rgba(74,144,226,0.1)]"
        @click="handleSelect(option)"
      >
        <div class="text-[32px] text-[#4A90E2]">
          <VIcon :icon="option.icon" />
        </div>
        <div class="text-center text-[13px] text-[#666]">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon, IconName } from '@/components/ui';

interface ChartOption {
  label: string;
  value: string;
  icon: IconName;
  data: {
    chartType: 'bar' | 'column' | 'line' | 'pie' | 'ring' | 'area' | 'radar' | 'scatter';
  };
}

const chartOptions: ChartOption[] = [
  {
    label: '柱状图',
    value: 'bar',
    icon: 'mdi:chart-bar',
    data: {
      chartType: 'bar',
    },
  },
  {
    label: '条形图',
    value: 'column',
    icon: 'mdi:chart-bar-stacked',
    data: {
      chartType: 'column',
    },
  },
  {
    label: '折线图',
    value: 'line',
    icon: 'mdi:chart-line',
    data: {
      chartType: 'line',
    },
  },
  {
    label: '饼图',
    value: 'pie',
    icon: 'mdi:chart-pie',
    data: {
      chartType: 'pie',
    },
  },
  {
    label: '环形图',
    value: 'ring',
    icon: 'mdi:chart-donut',
    data: {
      chartType: 'ring',
    },
  },
  {
    label: '面积图',
    value: 'area',
    icon: 'mdi:chart-areaspline',
    data: {
      chartType: 'area',
    },
  },
  {
    label: '雷达图',
    value: 'radar',
    icon: 'mdi:chart-radar',
    data: {
      chartType: 'radar',
    },
  },
  {
    label: '散点图',
    value: 'scatter',
    icon: 'mdi:chart-scatter-plot',
    data: {
      chartType: 'scatter',
    },
  },
];

const emit = defineEmits<{
  select: [option: ChartOption];
}>();

const handleSelect = (option: ChartOption) => {
  emit('select', option);
};
</script>
