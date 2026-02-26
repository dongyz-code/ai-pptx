import { OPERATE_RESIZE_HANDLERS, OPERATE_LINE } from '@/constants';
import { getKeys } from '@/utils';
import type { AlignLine, OperateLineHandlers, PPTElement, PPTLineElement } from '@/types';

type RectPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
};
/**
 * 计算旋转矩形的范围
 */
export function getRectRotateRange(rect: RectPosition) {
  const { left, top, width, height, rotate = 0 } = rect;
  const theta = rotate * (Math.PI / 180);

  const xCenter = left + width / 2;
  const yCenter = top + height / 2;

  const xList = [
    xCenter + (width / 2) * Math.cos(theta) - (height / 2) * Math.sin(theta),
    xCenter + (width / 2) * Math.cos(theta) + (height / 2) * Math.sin(theta),
    xCenter - (width / 2) * Math.cos(theta) - (height / 2) * Math.sin(theta),
    xCenter - (width / 2) * Math.cos(theta) + (height / 2) * Math.sin(theta),
  ];

  const yList = [
    yCenter + (width / 2) * Math.sin(theta) + (height / 2) * Math.cos(theta),
    yCenter + (width / 2) * Math.sin(theta) - (height / 2) * Math.cos(theta),
    yCenter - (width / 2) * Math.sin(theta) + (height / 2) * Math.cos(theta),
    yCenter - (width / 2) * Math.sin(theta) - (height / 2) * Math.cos(theta),
  ];

  return {
    x1: Math.min(...xList),
    x2: Math.max(...xList),
    y1: Math.min(...yList),
    y2: Math.max(...yList),
  };
}

/**
 * 获取矩形旋转后的8个关键控制点 (4个传统顶点 + 4个边中点)
 * 平面点旋转公式
 *  x' = x * cos - y * sin
 *  y' = x * sin + y * cos
 * @param rect 旋转矩形的范围
 */
export function getRectElementPoint(rect: RectPosition) {
  /** 从rect中解构出left、top、width、height和rotate属性，默认rotate为0 */
  const { left, top, width, height, rotate = 0 } = rect;
  /** 将rotate转换为弧度 */
  const theta = rotate * (Math.PI / 180);
  /** 计算旋转后的cos值和sin值 */
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  /** 计算矩形的中心点坐标 */
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  /** 定义8个控制点的相对位置（相对于中心点的偏移量） */
  const points = {
    leftTopPoint: { x: -width / 2, y: -height / 2 }, // 左上
    topPoint: { x: 0, y: -height / 2 }, // 上中
    rightTopPoint: { x: width / 2, y: -height / 2 }, // 右上,
    rightPoint: { x: width / 2, y: 0 }, // 右中,
    rightBottomPoint: { x: width / 2, y: height / 2 }, // 右下,
    bottomPoint: { x: 0, y: height / 2 }, // 下中,
    leftBottomPoint: { x: -width / 2, y: height / 2 }, // 左下,
    leftPoint: { x: -width / 2, y: 0 }, // 左中,
  };

  getKeys(points).forEach((key) => {
    const point = points[key];
    const { x, y } = point;
    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;
    point.x = centerX + rotatedX;
    point.y = centerY + rotatedY;
  });

  return points;
}

/**
 * 获取元素缩放点相对的另一个点的位置 如：【上】对应【下】、【左上】对应【右下】
 */
export function getOppositePoint(
  direction: OPERATE_RESIZE_HANDLERS,
  points: ReturnType<typeof getRectElementPoint>
) {
  const oppositeMap = {
    [OPERATE_RESIZE_HANDLERS.TOP]: points.bottomPoint,
    [OPERATE_RESIZE_HANDLERS.BOTTOM]: points.topPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT]: points.rightPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT]: points.leftPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT_TOP]: points.rightBottomPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT_TOP]: points.leftBottomPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM]: points.rightTopPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM]: points.leftTopPoint,
  };

  return oppositeMap[direction];
}

/**
 * 获取元素当前缩放掉位置
 * @param direction 方向
 * @param points 8个控制点
 */
export function getCurrentPoint(
  direction: OPERATE_RESIZE_HANDLERS,
  points: ReturnType<typeof getRectElementPoint>
) {
  const oppositeMap = {
    [OPERATE_RESIZE_HANDLERS.TOP]: points.topPoint,
    [OPERATE_RESIZE_HANDLERS.BOTTOM]: points.bottomPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT]: points.leftPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT]: points.rightPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT_TOP]: points.leftTopPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT_TOP]: points.rightTopPoint,
    [OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM]: points.leftBottomPoint,
    [OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM]: points.rightBottomPoint,
  };

  return oppositeMap[direction];
}

/**
 * 计算元素在画布中的位置范围
 */
export function getElementRange(element: PPTElement) {
  let x1: number, x2: number, y1: number, y2: number;

  if (element.type == 'line') {
    x1 = element.left;
    x2 = element.left + Math.max(element.start[0], element.end[0]);
    y1 = element.top;
    y2 = element.top + Math.max(element.start[1], element.end[1]);
  } else if ('rotate' in element && element.rotate) {
    const { left, top, width, height, rotate = 0 } = element;
    const rect = getRectRotateRange({ left, top, width, height, rotate });
    x1 = rect.x1;
    x2 = rect.x2;
    y1 = rect.y1;
    y2 = rect.y2;
  } else {
    x1 = element.left;
    x2 = element.left + element.width;
    y1 = element.top;
    y2 = element.top + element.height;
  }

  return { x1, x2, y1, y2 };
}

/**
 * 计算多个元素的包围盒
 */
export function getElementsRange(elements: PPTElement[]) {
  const x1List: number[] = [];
  const x2List: number[] = [];
  const y1List: number[] = [];
  const y2List: number[] = [];

  for (const element of elements) {
    const { x1, x2, y1, y2 } = getElementRange(element);
    x1List.push(x1);
    x2List.push(x2);
    y1List.push(y1);
    y2List.push(y2);
  }

  return {
    x1: Math.min(...x1List),
    x2: Math.max(...x2List),
    y1: Math.min(...y1List),
    y2: Math.max(...y2List),
  };
}

/**
 * 收集吸附线, 注意要排除自身
 * @param lines
 * @returns
 */
export function collectAlignLines({
  elementList,
  edgeWidth,
  edgeHeight,
}: {
  elementList: PPTElement[];
  edgeWidth: number;
  edgeHeight: number;
}) {
  /**
   * 收集各元素吸附线
   */
  let horizontalLines: AlignLine[] = [];
  let verticalLines: AlignLine[] = [];
  for (const item of elementList) {
    // 线条元素不参与
    if (item.type === 'line') continue;

    let left, top, width, height;
    if ('rotate' in item && item.rotate) {
      const { x1, x2, y1, y2 } = getRectRotateRange(item);
      left = x1;
      top = y1;
      width = x2 - x1;
      height = y2 - y1;
    } else {
      left = item.left;
      top = item.top;
      width = item.width;
      height = item.height;
    }

    const right = left + width;
    const bottom = top + height;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const topLine: AlignLine = { value: top, range: [left, right] };
    const bottomLine: AlignLine = { value: bottom, range: [left, right] };
    const horizontalCenterLine: AlignLine = { value: centerY, range: [left, right] };
    const leftLine: AlignLine = { value: left, range: [top, bottom] };
    const rightLine: AlignLine = { value: right, range: [top, bottom] };
    const verticalCenterLine: AlignLine = { value: centerX, range: [top, bottom] };

    horizontalLines.push(topLine, bottomLine, horizontalCenterLine);
    verticalLines.push(leftLine, rightLine, verticalCenterLine);
  }

  /**
   * 画布区域吸附线(四个边界，水平中心，垂直中线)
   */
  const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] };
  const edgeBottomLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] };
  const edgeHorizontalCenterLine: AlignLine = { value: edgeHeight / 2, range: [0, edgeWidth] };
  const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] };
  const edgeRightLine: AlignLine = { value: edgeWidth, range: [0, edgeHeight] };
  const edgeVerticalCenterLine: AlignLine = { value: edgeWidth / 2, range: [0, edgeHeight] };

  horizontalLines.push(edgeTopLine, edgeBottomLine, edgeHorizontalCenterLine);
  verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine);

  /**吸附线去重 */
  horizontalLines = uniqueAlignLines(horizontalLines);
  verticalLines = uniqueAlignLines(verticalLines);

  return { horizontalLines, verticalLines };
}

/**
 * 吸附线去重
 */
export function uniqueAlignLines(lines: AlignLine[]): AlignLine[] {
  const map: Map<number, AlignLine['range']> = new Map();
  for (const line of lines) {
    const { value, range } = line;
    if (!map.has(value)) {
      map.set(value, range);
      continue;
    }

    const old = map.get(value)!;
    old[0] = Math.min(old[0], range[0]);
    old[1] = Math.max(old[1], range[1]);
  }

  return Array.from(map.entries()).map(([value, range]) => ({ value, range }));
}

/**
 * 获取svg线条元素路径字符串
 */
export function getLineElementPath(element: PPTLineElement) {
  const start = element.start.join();
  const end = element.end.join();

  if (element.broken) {
    const mid = element.broken.join();
    return `M${start} L${mid} L${end}`;
  }

  if (element.broken2) {
    const { x1, x2, y1, y2 } = getElementRange(element);
    if (x2 - x1 >= y2 - y1) {
      return `M${start} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${end}`;
    } else {
      return `M${start} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${end}`;
    }
  }

  if (element.curve) {
    const mid = element.curve.join();
    return `M${start} Q${mid} ${end}`;
  }

  if (element.cubic) {
    const [c1, c2] = element.cubic;
    return `M${start} C${c1} ${c2} ${end}`;
  }

  return `M${start} L${end}`;
}

/**
 * 获取基本元素8个拖拽点
 */
export function getCommonOperate(width: number, height: number) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  /** 元素缩放点 */
  const resizeHandlers = [
    { direction: OPERATE_RESIZE_HANDLERS.LEFT_TOP, style: {} },
    { direction: OPERATE_RESIZE_HANDLERS.TOP, style: { left: halfWidth + 'px' } },
    { direction: OPERATE_RESIZE_HANDLERS.RIGHT_TOP, style: { left: width + 'px' } },
    { direction: OPERATE_RESIZE_HANDLERS.LEFT, style: { top: halfHeight + 'px' } },
    {
      direction: OPERATE_RESIZE_HANDLERS.RIGHT,
      style: { top: halfHeight + 'px', left: width + 'px' },
    },
    { direction: OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM, style: { top: height + 'px' } },
    {
      direction: OPERATE_RESIZE_HANDLERS.BOTTOM,
      style: { top: height + 'px', left: halfWidth + 'px' },
    },
    {
      direction: OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM,
      style: { top: height + 'px', left: width + 'px' },
    },
  ];

  /** 元素选中边框线 */
  const borderLines = [
    { type: OPERATE_LINE.T, style: { left: '0px', width: width + 'px' } },
    { type: OPERATE_LINE.L, style: { left: '0px', height: height + 'px' } },
    { type: OPERATE_LINE.B, style: { top: height + 'px', width: width + 'px' } },
    { type: OPERATE_LINE.R, style: { left: width + 'px', height: height + 'px' } },
  ];

  return {
    resizeHandlers,
    borderLines,
  };
}
