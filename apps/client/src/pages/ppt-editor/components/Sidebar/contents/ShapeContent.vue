<template>
  <div class="shape-content">
    <div class="content-title">选择形状</div>
    <div class="shape-options">
      <div
        v-for="option in shapeOptions"
        :key="option.value"
        class="shape-option"
        @click="handleSelect(option)"
      >
        <div class="shape-preview" v-html="option.preview"></div>
        <div class="shape-label">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ShapeOption {
  label: string;
  value: string;
  preview: string;
  data: {
    viewBox: [number, number];
    path: string;
    fill: string;
    pathFormula?: string;
  };
}

const shapeOptions: ShapeOption[] = [
  {
    label: '矩形',
    value: 'rectangle',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><rect width="50" height="40" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '圆形',
    value: 'circle',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><circle cx="25" cy="20" r="20" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '圆角矩形',
    value: 'roundRect',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><rect width="50" height="40" rx="5" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 Z',
      fill: '#4A90E2',
      pathFormula: 'roundRect',
    },
  },
  {
    label: '三角形',
    value: 'triangle',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="25,5 45,35 5,35" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 200 200 L 0 200 Z',
      fill: '#4A90E2',
      pathFormula: 'triangle',
    },
  },
  {
    label: '菱形',
    value: 'diamond',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="25,2 48,20 25,38 2,20" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 200 100 L 100 200 L 0 100 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '平行四边形',
    value: 'parallelogram',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="10,2 48,2 40,38 2,38" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 50 0 L 200 0 L 150 200 L 0 200 Z',
      fill: '#4A90E2',
      pathFormula: 'parallelogramRight',
    },
  },
  {
    label: '梯形',
    value: 'trapezoid',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="15,2 35,2 45,38 5,38" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 50 0 L 150 0 L 200 200 L 0 200 Z',
      fill: '#4A90E2',
      pathFormula: 'trapezoid',
    },
  },
  {
    label: '五角星',
    value: 'star',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="25,3 28,16 41,16 31,24 34,37 25,29 16,37 19,24 9,16 22,16" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 120 70 L 190 80 L 130 130 L 150 200 L 100 160 L 50 200 L 70 130 L 10 80 L 80 70 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '五边形',
    value: 'pentagon',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="25,3 45,15 38,35 12,35 5,15" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 190 70 L 160 200 L 40 200 L 10 70 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '六边形',
    value: 'hexagon',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="12,2 38,2 48,20 38,38 12,38 2,20" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 50 0 L 150 0 L 200 100 L 150 200 L 50 200 L 0 100 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '右箭头',
    value: 'arrowRight',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="2,12 30,12 30,2 48,20 30,38 30,28 2,28" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 0 60 L 140 60 L 140 0 L 200 100 L 140 200 L 140 140 L 0 140 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '左箭头',
    value: 'arrowLeft',
    preview: '<svg viewBox="0 0 50 40" width="50" height="40"><polygon points="48,12 20,12 20,2 2,20 20,38 20,28 48,28" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 200 60 L 60 60 L 60 0 L 0 100 L 60 200 L 60 140 L 200 140 Z',
      fill: '#4A90E2',
    },
  },
];

const emit = defineEmits<{
  select: [option: ShapeOption];
}>();

const handleSelect = (option: ShapeOption) => {
  emit('select', option);
};
</script>

<style scoped>
.shape-content {
  min-width: 380px;
  max-width: 500px;
  padding: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.content-title {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 12px;
}

.shape-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.shape-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.shape-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.shape-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 40px;
}

.shape-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
