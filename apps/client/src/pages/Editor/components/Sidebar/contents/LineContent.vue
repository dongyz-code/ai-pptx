<template>
  <div class="line-content">
    <div class="content-title">选择线条类型</div>
    <div class="line-options">
      <div
        v-for="option in lineOptions"
        :key="option.value"
        class="line-option"
        @click="handleSelect(option)"
      >
        <div class="line-preview" v-html="option.preview"></div>
        <div class="line-label">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LineOption {
  label: string;
  value: string;
  preview: string;
  data: {
    style: 'solid' | 'dashed' | 'dotted';
    points: ['' | 'arrow' | 'dot', '' | 'arrow' | 'dot'];
    color: string;
  };
}

const lineOptions: LineOption[] = [
  {
    label: '直线',
    value: 'straight',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2"/></svg>',
    data: {
      style: 'solid',
      points: ['', ''],
      color: '#4A90E2',
    },
  },
  {
    label: '箭头线',
    value: 'arrow',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#4A90E2" /></marker></defs><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" marker-end="url(#arrowhead)"/></svg>',
    data: {
      style: 'solid',
      points: ['', 'arrow'],
      color: '#4A90E2',
    },
  },
  {
    label: '双箭头线',
    value: 'doubleArrow',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><defs><marker id="arrowstart" markerWidth="10" markerHeight="10" refX="2" refY="3" orient="auto"><polygon points="10 0, 0 3, 10 6" fill="#4A90E2" /></marker><marker id="arrowend" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#4A90E2" /></marker></defs><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" marker-start="url(#arrowstart)" marker-end="url(#arrowend)"/></svg>',
    data: {
      style: 'solid',
      points: ['arrow', 'arrow'],
      color: '#4A90E2',
    },
  },
  {
    label: '虚线',
    value: 'dashed',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" stroke-dasharray="5,5"/></svg>',
    data: {
      style: 'dashed',
      points: ['', ''],
      color: '#4A90E2',
    },
  },
  {
    label: '虚线箭头',
    value: 'dashedArrow',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><defs><marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#4A90E2" /></marker></defs><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead2)"/></svg>',
    data: {
      style: 'dashed',
      points: ['', 'arrow'],
      color: '#4A90E2',
    },
  },
  {
    label: '点线',
    value: 'dotted',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" stroke-dasharray="2,3"/></svg>',
    data: {
      style: 'dotted',
      points: ['', ''],
      color: '#4A90E2',
    },
  },
  {
    label: '圆点线',
    value: 'dotLine',
    preview: '<svg viewBox="0 0 60 20" width="60" height="20"><defs><marker id="dot1" markerWidth="6" markerHeight="6" refX="3" refY="3"><circle cx="3" cy="3" r="2" fill="#4A90E2" /></marker><marker id="dot2" markerWidth="6" markerHeight="6" refX="3" refY="3"><circle cx="3" cy="3" r="2" fill="#4A90E2" /></marker></defs><line x1="5" y1="10" x2="55" y2="10" stroke="#4A90E2" stroke-width="2" marker-start="url(#dot1)" marker-end="url(#dot2)"/></svg>',
    data: {
      style: 'solid',
      points: ['dot', 'dot'],
      color: '#4A90E2',
    },
  },
];

const emit = defineEmits<{
  select: [option: LineOption];
}>();

const handleSelect = (option: LineOption) => {
  emit('select', option);
};
</script>

<style scoped>
.line-content {
  min-width: 300px;
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

.line-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.line-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.line-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.line-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-label {
  font-size: 13px;
  color: #666;
  min-width: 80px;
}
</style>
