import { AlignLine, PPTElement, PPTLineElement } from '@/types';

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
    return `M${start} c${c1} c${c2} ${end}`;
  }

  return `M${start} L${end}`;
}
