import type { PPTElementOutline } from '@/types';
import type { ShapeDragData } from '../../../hooks/useDragCreate';

export interface ShapeOption {
  label: string;
  value: string;
  preview: string;
  data: ShapeDragData;
}

export interface ShapeGroup {
  label: string;
  items: ShapeOption[];
}

const baseFill = 'transparent';
const baseOutline: PPTElementOutline = {
  width: 1,
  color: '#111111',
  style: 'solid',
};

const createPreview = (path: string, viewBox: [number, number] = [200, 200]) => {
  return `<svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" overflow="visible" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="${baseFill}" stroke="${baseOutline.color}" stroke-width="${baseOutline.width}" vector-effect="non-scaling-stroke"/></svg>`;
};

const createShape = (
  label: string,
  value: string,
  path: string,
  size: [number, number],
  options: Partial<ShapeDragData> = {}
): ShapeOption => {
  return {
    label,
    value,
    preview: createPreview(path, options.viewBox),
    data: {
      viewBox: [200, 200],
      path,
      fill: baseFill,
      outline: { ...baseOutline },
      width: size[0],
      height: size[1],
      fixedRatio: options.fixedRatio ?? false,
      pathFormula: options.pathFormula,
      ...options,
    },
  };
};

/** 矩形 */
const rectangleShapes: ShapeOption[] = [
  createShape('矩形', 'rect', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [140, 90]),
  createShape(
    '圆角矩形',
    'roundRect',
    'M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 Z',
    [140, 90]
  ),
  createShape(
    '切角矩形',
    'cutRect',
    'M 20 0 L 180 0 L 200 20 L 200 180 L 180 200 L 20 200 L 0 180 L 0 20 Z',
    [140, 90]
  ),
  createShape(
    '单圆角矩形',
    'singleRoundRect',
    'M 0 0 L 180 0 Q 200 0 200 20 L 200 200 L 0 200 Z',
    [140, 90]
  ),
  createShape(
    '对角圆角矩形',
    'diagonalRoundRect',
    'M 20 0 L 200 0 L 200 180 Q 200 200 180 200 L 0 200 L 0 20 Q 0 0 20 0 Z',
    [140, 90]
  ),
  createShape(
    '单切角矩形',
    'singleCutRect',
    'M 0 0 L 180 0 L 200 20 L 200 200 L 0 200 Z',
    [140, 90]
  ),
  createShape('正方形', 'square', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [120, 120], {
    fixedRatio: true,
  }),
  createShape(
    '圆角正方形',
    'roundSquare',
    'M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 Z',
    [120, 120],
    { fixedRatio: true }
  ),
  createShape(
    '切角正方形',
    'cutSquare',
    'M 20 0 L 180 0 L 200 20 L 200 180 L 180 200 L 20 200 L 0 180 L 0 20 Z',
    [120, 120],
    { fixedRatio: true }
  ),
];

/** 基础形状 */
const basicShapes: ShapeOption[] = [
  createShape(
    '圆形',
    'circle',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z',
    [120, 120],
    { fixedRatio: true }
  ),
  createShape('三角形', 'triangle', 'M 100 0 L 200 200 L 0 200 Z', [120, 110], {
    fixedRatio: true,
  }),
  createShape('直角三角形', 'rightTriangle', 'M 0 0 L 200 200 L 0 200 Z', [120, 110], {
    fixedRatio: true,
  }),
  createShape('平行四边形', 'parallelogram', 'M 40 0 L 200 0 L 160 200 L 0 200 Z', [150, 100]),
  createShape('梯形', 'trapezoid', 'M 40 0 L 160 0 L 200 200 L 0 200 Z', [150, 100]),
  createShape('菱形', 'diamond', 'M 100 0 L 200 100 L 100 200 L 0 100 Z', [120, 120], {
    fixedRatio: true,
  }),
  createShape('五边形', 'pentagon', 'M 100 0 L 195 69 L 159 200 L 41 200 L 5 69 Z', [130, 120], {
    fixedRatio: true,
  }),
  createShape(
    '六边形',
    'hexagon',
    'M 50 0 L 150 0 L 200 100 L 150 200 L 50 200 L 0 100 Z',
    [140, 120],
    { fixedRatio: true }
  ),
  createShape(
    '七边形',
    'heptagon',
    'M 100 0 L 178 43 L 197 129 L 139 200 L 61 200 L 3 129 L 22 43 Z',
    [130, 130],
    { fixedRatio: true }
  ),
  createShape(
    '八边形',
    'octagon',
    'M 59 0 L 141 0 L 200 59 L 200 141 L 141 200 L 59 200 L 0 141 L 0 59 Z',
    [130, 130],
    { fixedRatio: true }
  ),
  createShape(
    '十边形',
    'decagon',
    'M 100 0 L 159 19 L 200 69 L 200 131 L 159 181 L 100 200 L 41 181 L 0 131 L 0 69 L 41 19 Z',
    [130, 130],
    { fixedRatio: true }
  ),
  createShape(
    '十二边形',
    'dodecagon',
    'M 100 0 L 150 13 L 187 50 L 200 100 L 187 150 L 150 187 L 100 200 L 50 187 L 13 150 L 0 100 L 13 50 L 50 13 Z',
    [130, 130],
    { fixedRatio: true }
  ),
  createShape(
    '月牙',
    'crescent',
    'M 160 0 A 100 100 0 1 0 160 200 A 70 100 0 1 1 160 0 Z',
    [120, 120],
    { fixedRatio: true }
  ),
  createShape(
    '椭圆',
    'ellipse',
    'M 100 0 A 100 50 0 1 1 100 100 A 100 50 0 1 1 100 0 Z',
    [160, 100],
    { viewBox: [200, 100] }
  ),
  createShape(
    '五角星',
    'star5',
    'M 100 0 L 122 69 L 195 69 L 137 112 L 159 181 L 100 138 L 41 181 L 63 112 L 5 69 L 78 69 Z',
    [140, 130],
    { fixedRatio: true }
  ),
  createShape(
    '四角星',
    'star4',
    'M 100 0 L 125 75 L 200 100 L 125 125 L 100 200 L 75 125 L 0 100 L 75 75 Z',
    [120, 120],
    { fixedRatio: true }
  ),
  createShape(
    '六角星',
    'star6',
    'M 100 0 L 133 50 L 200 50 L 167 100 L 200 150 L 133 150 L 100 200 L 67 150 L 0 150 L 33 100 L 0 50 L 67 50 Z',
    [130, 130],
    { fixedRatio: true }
  ),
  createShape(
    '十字形',
    'cross',
    'M 70 0 L 130 0 L 130 70 L 200 70 L 200 130 L 130 130 L 130 200 L 70 200 L 70 130 L 0 130 L 0 70 L 70 70 Z',
    [120, 120],
    { fixedRatio: true }
  ),
  createShape(
    '心形',
    'heart',
    'M 100 40 C 60 0 0 20 0 80 C 0 140 100 200 100 200 C 100 200 200 140 200 80 C 200 20 140 0 100 40 Z',
    [130, 120],
    { fixedRatio: true }
  ),
  createShape(
    '圆环',
    'ring',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z M 100 40 A 60 60 0 1 0 100 160 A 60 60 0 1 0 100 40 Z',
    [120, 120],
    { fixedRatio: true }
  ),
];

/** 箭头 */
const arrowShapes: ShapeOption[] = [
  createShape(
    '右箭头',
    'arrowRight',
    'M 0 60 L 120 60 L 120 20 L 200 100 L 120 180 L 120 140 L 0 140 Z',
    [150, 100]
  ),
  createShape(
    '左箭头',
    'arrowLeft',
    'M 200 60 L 80 60 L 80 20 L 0 100 L 80 180 L 80 140 L 200 140 Z',
    [150, 100]
  ),
  createShape(
    '上箭头',
    'arrowUp',
    'M 100 0 L 180 80 L 140 80 L 140 200 L 60 200 L 60 80 L 20 80 Z',
    [100, 150]
  ),
  createShape(
    '下箭头',
    'arrowDown',
    'M 60 0 L 140 0 L 140 120 L 180 120 L 100 200 L 20 120 L 60 120 Z',
    [100, 150]
  ),
  createShape(
    '左右双箭头',
    'doubleArrowH',
    'M 0 100 L 50 50 L 50 75 L 150 75 L 150 50 L 200 100 L 150 150 L 150 125 L 50 125 L 50 150 Z',
    [160, 100]
  ),
  createShape(
    '上下双箭头',
    'doubleArrowV',
    'M 100 0 L 150 50 L 125 50 L 125 150 L 150 150 L 100 200 L 50 150 L 75 150 L 75 50 L 50 50 Z',
    [100, 160]
  ),
  createShape(
    '燕尾箭头右',
    'chevronRight',
    'M 0 0 L 150 0 L 200 100 L 150 200 L 0 200 L 50 100 Z',
    [150, 100]
  ),
  createShape(
    '燕尾箭头左',
    'chevronLeft',
    'M 50 0 L 200 0 L 150 100 L 200 200 L 50 200 L 0 100 Z',
    [150, 100]
  ),
  createShape(
    '五边形箭头',
    'pentagonArrow',
    'M 0 0 L 150 0 L 200 100 L 150 200 L 0 200 Z',
    [150, 100]
  ),
  createShape(
    '弯箭头',
    'bentArrow',
    'M 0 50 L 50 0 L 50 30 L 150 30 L 150 100 L 200 100 L 140 160 L 80 100 L 130 100 L 130 50 L 50 50 L 50 100 Z',
    [150, 120]
  ),
  createShape(
    'U型箭头',
    'uturnArrow',
    'M 0 50 L 50 0 L 50 30 L 100 30 Q 160 30 160 90 L 160 140 L 200 140 L 140 200 L 80 140 L 120 140 L 120 90 Q 120 70 100 70 L 50 70 L 50 100 Z',
    [150, 150]
  ),
  createShape(
    '直角箭头',
    'cornerArrow',
    'M 0 40 L 120 40 L 120 0 L 200 80 L 120 160 L 120 120 L 0 120 Z',
    [150, 120]
  ),
  createShape(
    '条纹箭头',
    'stripedArrow',
    'M 80 40 L 80 0 L 200 100 L 80 200 L 80 160 L 120 160 L 120 40 Z M 0 40 L 60 40 L 60 160 L 0 160 Z',
    [150, 120]
  ),
  createShape(
    '缺口箭头',
    'notchedArrow',
    'M 0 60 L 120 60 L 120 20 L 200 100 L 120 180 L 120 140 L 0 140 L 40 100 Z',
    [150, 100]
  ),
];

/** 公式形状 */
const formulaShapes: ShapeOption[] = [
  createShape(
    '加号',
    'plus',
    'M 80 0 L 120 0 L 120 80 L 200 80 L 200 120 L 120 120 L 120 200 L 80 200 L 80 120 L 0 120 L 0 80 L 80 80 Z',
    [100, 100],
    { fixedRatio: true }
  ),
  createShape('减号', 'minus', 'M 0 80 L 200 80 L 200 120 L 0 120 Z', [120, 60]),
  createShape(
    '乘号',
    'multiply',
    'M 30 0 L 100 70 L 170 0 L 200 30 L 130 100 L 200 170 L 170 200 L 100 130 L 30 200 L 0 170 L 70 100 L 0 30 Z',
    [100, 100],
    { fixedRatio: true }
  ),
  createShape(
    '除号',
    'divide',
    'M 85 30 A 15 15 0 1 1 115 30 A 15 15 0 1 1 85 30 Z M 0 90 L 200 90 L 200 110 L 0 110 Z M 85 170 A 15 15 0 1 1 115 170 A 15 15 0 1 1 85 170 Z',
    [100, 120],
    { fixedRatio: true }
  ),
  createShape(
    '等号',
    'equal',
    'M 0 60 L 200 60 L 200 85 L 0 85 Z M 0 115 L 200 115 L 200 140 L 0 140 Z',
    [120, 80]
  ),
  createShape(
    '不等号',
    'notEqual',
    'M 0 60 L 200 60 L 200 85 L 0 85 Z M 0 115 L 200 115 L 200 140 L 0 140 Z M 30 20 L 50 20 L 170 180 L 150 180 Z',
    [120, 100]
  ),
];

/** 流程图 */
const flowchartShapes: ShapeOption[] = [
  // 流程
  createShape('流程', 'flowProcess', 'M 0 0 L 200 0 L 200 200 L 0 200 Z', [140, 90]),
  // 终止符
  createShape(
    '终止符',
    'flowTerminator',
    'M 50 0 L 150 0 A 50 100 0 0 1 150 200 L 50 200 A 50 100 0 0 1 50 0 Z',
    [150, 80]
  ),
  // 决策
  createShape('决策', 'flowDecision', 'M 100 0 L 200 100 L 100 200 L 0 100 Z', [120, 100]),
  // 数据/IO
  createShape('数据', 'flowData', 'M 40 0 L 200 0 L 160 200 L 0 200 Z', [150, 90]),
  // 预定义流程
  createShape(
    '预定义流程',
    'flowPredefined',
    'M 0 0 L 200 0 L 200 200 L 0 200 Z M 20 0 L 20 200 M 180 0 L 180 200',
    [150, 90]
  ),
  // 内部存储
  createShape(
    '内部存储',
    'flowInternalStorage',
    'M 0 0 L 200 0 L 200 200 L 0 200 Z M 30 0 L 30 200 M 0 30 L 200 30',
    [120, 120]
  ),
  // 手动输入
  createShape('手动输入', 'flowManualInput', 'M 0 40 L 200 0 L 200 200 L 0 200 Z', [150, 90]),
  // 手动操作
  createShape('手动操作', 'flowManualOperation', 'M 20 0 L 180 0 L 200 200 L 0 200 Z', [150, 90]),
  // 准备
  createShape(
    '准备',
    'flowPreparation',
    'M 40 0 L 160 0 L 200 100 L 160 200 L 40 200 L 0 100 Z',
    [150, 90]
  ),
  // 离页连接符
  createShape(
    '离页连接符',
    'flowOffPage',
    'M 0 0 L 200 0 L 200 150 L 100 200 L 0 150 Z',
    [100, 100]
  ),
  // 文档
  createShape(
    '文档',
    'flowDocument',
    'M 0 0 L 200 0 L 200 170 Q 150 150 100 170 Q 50 190 0 170 Z',
    [150, 100]
  ),
  // 多文档
  createShape(
    '多文档',
    'flowMultiDocument',
    'M 20 20 L 180 20 L 180 10 L 200 10 L 200 0 L 220 0 L 220 150 Q 170 130 120 150 Q 70 170 20 150 Z M 200 30 L 220 30 L 220 160',
    [160, 110],
    { viewBox: [240, 180] }
  ),
  // 延时
  createShape('延时', 'flowDelay', 'M 0 0 L 150 0 A 50 100 0 0 1 150 200 L 0 200 Z', [150, 90]),
  // 或
  createShape(
    '或',
    'flowOr',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z M 100 0 L 100 200 M 0 100 L 200 100',
    [100, 100],
    { fixedRatio: true }
  ),
  // 汇总
  createShape(
    '汇总',
    'flowSummingJunction',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z M 29 29 L 171 171 M 171 29 L 29 171',
    [100, 100],
    { fixedRatio: true }
  ),
  // 显示
  createShape(
    '显示',
    'flowDisplay',
    'M 40 0 L 160 0 Q 200 0 200 100 Q 200 200 160 200 L 40 200 L 0 100 Z',
    [150, 90]
  ),
  // 存储数据
  createShape(
    '存储数据',
    'flowStoredData',
    'M 40 0 L 200 0 Q 160 100 200 200 L 40 200 Q 0 100 40 0 Z',
    [150, 90]
  ),
  // 磁带
  createShape(
    '磁带',
    'flowSequentialData',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 0 1 200 100 L 200 200 L 100 200',
    [120, 120],
    { fixedRatio: true }
  ),
  // 直接访问存储
  createShape(
    '直接存储',
    'flowDirectData',
    'M 30 0 L 200 0 A 30 100 0 0 1 200 200 L 30 200 A 30 100 0 0 1 30 0 Z',
    [150, 90]
  ),
  // 磁盘
  createShape(
    '磁盘',
    'flowDisk',
    'M 0 40 A 100 40 0 0 1 200 40 L 200 160 A 100 40 0 0 1 0 160 Z M 0 40 A 100 40 0 0 0 200 40',
    [130, 100]
  ),
  // 卡片
  createShape('卡片', 'flowCard', 'M 40 0 L 200 0 L 200 200 L 0 200 L 0 40 Z', [140, 100]),
  // 纸带
  createShape(
    '纸带',
    'flowPunchedTape',
    'M 0 20 Q 50 0 100 20 Q 150 40 200 20 L 200 180 Q 150 200 100 180 Q 50 160 0 180 Z',
    [150, 100]
  ),
  // 对照
  createShape(
    '对照',
    'flowCollate',
    'M 0 0 L 200 0 L 100 100 L 200 200 L 0 200 L 100 100 Z',
    [100, 120]
  ),
  // 排序
  createShape(
    '排序',
    'flowSort',
    'M 100 0 L 200 100 L 100 200 L 0 100 Z M 0 100 L 200 100',
    [100, 120]
  ),
  // 摘录
  createShape('摘录', 'flowExtract', 'M 100 0 L 200 200 L 0 200 Z', [120, 100]),
  // 合并
  createShape('合并', 'flowMerge', 'M 0 0 L 200 0 L 100 200 Z', [120, 100]),
  // 连接符
  createShape(
    '连接符',
    'flowConnector',
    'M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0 Z',
    [80, 80],
    { fixedRatio: true }
  ),
];

/** 标注 */
const calloutShapes: ShapeOption[] = [
  createShape(
    '矩形标注',
    'calloutRect',
    'M 0 0 L 200 0 L 200 140 L 80 140 L 40 200 L 60 140 L 0 140 Z',
    [160, 110]
  ),
  createShape(
    '圆角标注',
    'calloutRoundRect',
    'M 20 0 L 180 0 Q 200 0 200 20 L 200 120 Q 200 140 180 140 L 80 140 L 40 200 L 60 140 L 20 140 Q 0 140 0 120 L 0 20 Q 0 0 20 0 Z',
    [160, 110]
  ),
  createShape(
    '椭圆标注',
    'calloutOval',
    'M 100 0 A 100 60 0 1 1 100 120 L 60 120 L 40 180 L 70 120 A 100 60 0 0 1 100 0 Z',
    [160, 110],
    { viewBox: [200, 180] }
  ),
];

export const shapeGroups: ShapeGroup[] = [
  { label: '矩形', items: rectangleShapes },
  { label: '基础形状', items: basicShapes },
  { label: '箭头', items: arrowShapes },
  { label: '公式形状', items: formulaShapes },
  { label: '流程图', items: flowchartShapes },
  { label: '标注', items: calloutShapes },
];
