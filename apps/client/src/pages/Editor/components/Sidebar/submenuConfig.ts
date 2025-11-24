import type { SubmenuItem } from './Submenu.vue';

// 文字类型配置
export const textSubmenuItems: SubmenuItem[] = [
  {
    label: '正文',
    value: 'body',
    data: {
      content: '正文内容',
      fontSize: '16px',
      fontWeight: 'normal',
    },
  },
  {
    label: '一级标题',
    value: 'heading1',
    data: {
      content: '一级标题',
      fontSize: '32px',
      fontWeight: 'bold',
    },
  },
  {
    label: '二级标题',
    value: 'heading2',
    data: {
      content: '二级标题',
      fontSize: '24px',
      fontWeight: 'bold',
    },
  },
  {
    label: '三级标题',
    value: 'heading3',
    data: {
      content: '三级标题',
      fontSize: '20px',
      fontWeight: '600',
    },
  },
  {
    label: '副标题',
    value: 'subtitle',
    data: {
      content: '副标题',
      fontSize: '18px',
      fontWeight: '500',
    },
  },
];

// 形状类型配置
export const shapeSubmenuItems: SubmenuItem[] = [
  {
    label: '矩形',
    value: 'rectangle',
    preview: '<svg viewBox="0 0 40 30"><rect width="40" height="30" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '圆形',
    value: 'circle',
    preview: '<svg viewBox="0 0 40 30"><circle cx="20" cy="15" r="15" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '圆角矩形',
    value: 'roundRect',
    preview: '<svg viewBox="0 0 40 30"><rect width="40" height="30" rx="4" fill="#4A90E2"/></svg>',
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
    preview: '<svg viewBox="0 0 40 30"><polygon points="20,0 40,30 0,30" fill="#4A90E2"/></svg>',
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
    preview: '<svg viewBox="0 0 40 30"><polygon points="20,0 40,15 20,30 0,15" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 200 100 L 100 200 L 0 100 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '平行四边形',
    value: 'parallelogram',
    preview: '<svg viewBox="0 0 40 30"><polygon points="10,0 40,0 30,30 0,30" fill="#4A90E2"/></svg>',
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
    preview: '<svg viewBox="0 0 40 30"><polygon points="10,0 30,0 40,30 0,30" fill="#4A90E2"/></svg>',
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
    preview:
      '<svg viewBox="0 0 40 30"><polygon points="20,2 24,14 36,14 26,22 30,34 20,26 10,34 14,22 4,14 16,14" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 120 70 L 190 80 L 130 130 L 150 200 L 100 160 L 50 200 L 70 130 L 10 80 L 80 70 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '五边形',
    value: 'pentagon',
    preview: '<svg viewBox="0 0 40 30"><polygon points="20,2 38,12 32,30 8,30 2,12" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 100 0 L 190 70 L 160 200 L 40 200 L 10 70 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '六边形',
    value: 'hexagon',
    preview: '<svg viewBox="0 0 40 30"><polygon points="10,0 30,0 40,15 30,30 10,30 0,15" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 50 0 L 150 0 L 200 100 L 150 200 L 50 200 L 0 100 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '右箭头',
    value: 'arrowRight',
    preview: '<svg viewBox="0 0 40 30"><polygon points="0,8 24,8 24,0 40,15 24,30 24,22 0,22" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 0 60 L 140 60 L 140 0 L 200 100 L 140 200 L 140 140 L 0 140 Z',
      fill: '#4A90E2',
    },
  },
  {
    label: '左箭头',
    value: 'arrowLeft',
    preview: '<svg viewBox="0 0 40 30"><polygon points="40,8 16,8 16,0 0,15 16,30 16,22 40,22" fill="#4A90E2"/></svg>',
    data: {
      viewBox: [200, 200],
      path: 'M 200 60 L 60 60 L 60 0 L 0 100 L 60 200 L 60 140 L 200 140 Z',
      fill: '#4A90E2',
    },
  },
];
