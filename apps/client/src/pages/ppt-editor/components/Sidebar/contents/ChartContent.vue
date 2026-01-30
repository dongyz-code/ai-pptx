<template>
  <div class="chart-content">
    <div class="content-title">选择图表类型</div>
    <div class="chart-options">
      <div
        v-for="option in chartOptions"
        :key="option.value"
        class="chart-option"
        @click="handleSelect(option)"
      >
        <div class="chart-icon">
          <VIcon :icon="option.icon" />
        </div>
        <div class="chart-label">{{ option.label }}</div>
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

<style scoped>
.chart-content {
  min-width: 340px;
  padding: 12px;
}

.content-title {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 12px;
}

.chart-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.chart-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.chart-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.chart-icon {
  font-size: 32px;
  color: #4a90e2;
}

.chart-label {
  font-size: 13px;
  color: #666;
  text-align: center;
}
</style>
