import { useEditor, useSlides } from '../models';
import { uuid } from '@/utils';

import type { PPTElement, PPTShapeElement, PPTLineElement } from '@/types';

/** 拖拽数据类型定义 */
export type DragDataType = 'shape' | 'line' | 'image' | 'text' | 'chart';

/** MIME 类型映射 */
const MIME_TYPE_MAP: Record<DragDataType, string> = {
  shape: 'application/x-ppt-shape',
  line: 'application/x-ppt-line',
  image: 'application/x-ppt-image',
  text: 'application/x-ppt-text',
  chart: 'application/x-ppt-chart',
};

/** 获取所有支持的 MIME 类型 */
const ALL_MIME_TYPES = Object.values(MIME_TYPE_MAP);

/** Shape 拖拽数据 */
export type ShapeDragData = Pick<
  PPTShapeElement,
  'viewBox' | 'path' | 'fill' | 'fixedRatio' | 'pathFormula' | 'outline'
> & {
  width?: number;
  height?: number;
};

/** Line 拖拽数据 */
export type LineDragData = Pick<PPTLineElement, 'start' | 'end' | 'style' | 'color' | 'points'> & {
  width?: number;
  height?: number;
};

/** 拖拽数据联合类型 */
export type DragData = ShapeDragData | LineDragData;

/**
 * 拖拽创建元素的 Hook
 * 提供统一的拖拽开始和放置处理
 */
export const useDragCreate = () => {
  const { editorState } = useEditor();
  const { addElement } = useSlides();

  /**
   * 开始拖拽 - 在拖拽源组件中使用
   * @param event 拖拽事件
   * @param type 拖拽数据类型
   * @param data 拖拽数据
   * @param label 可选的文本标签（用于备用显示）
   */
  const startDrag = <T extends DragData>(
    event: DragEvent,
    type: DragDataType,
    data: T,
    label?: string
  ) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(MIME_TYPE_MAP[type], JSON.stringify(data));
    if (label) {
      event.dataTransfer.setData('text/plain', label);
    }
  };

  /**
   * 检查是否允许放置 - 在 dragover 事件中使用
   * @param event 拖拽事件
   * @param allowedTypes 允许的拖拽类型，默认允许所有类型
   */
  const allowDrop = (event: DragEvent, allowedTypes?: DragDataType[]) => {
    if (!event.dataTransfer) return false;

    const mimeTypes = allowedTypes ? allowedTypes.map((t) => MIME_TYPE_MAP[t]) : ALL_MIME_TYPES;

    const hasValidType = mimeTypes.some((mime) => event.dataTransfer!.types.includes(mime));

    if (hasValidType) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      return true;
    }
    return false;
  };

  /**
   * 计算放置位置 - 考虑画布缩放
   * @param event 拖拽事件
   * @param elementWidth 元素宽度
   * @param elementHeight 元素高度
   */
  const calculateDropPosition = (
    event: DragEvent,
    elementWidth: number,
    elementHeight: number
  ): { left: number; top: number } => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const scale = editorState.viewportScale;

    return {
      left: (event.clientX - rect.left) / scale - elementWidth / 2,
      top: (event.clientY - rect.top) / scale - elementHeight / 2,
    };
  };

  /**
   * 处理放置 Shape 元素
   */
  const handleDropShape = (event: DragEvent): PPTShapeElement | null => {
    if (!event.dataTransfer) return null;

    const raw = event.dataTransfer.getData(MIME_TYPE_MAP.shape);
    if (!raw) return null;

    event.preventDefault();
    const payload = JSON.parse(raw) as ShapeDragData;
    const width = payload.width ?? 140;
    const height = payload.height ?? 90;
    const position = calculateDropPosition(event, width, height);

    const element: PPTShapeElement = {
      id: uuid(),
      type: 'shape',
      left: position.left,
      top: position.top,
      width,
      height,
      rotate: 0,
      viewBox: payload.viewBox ?? [200, 200],
      path: payload.path ?? 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
      fill: payload.fill ?? '#f2f2f2',
      fixedRatio: payload.fixedRatio ?? false,
      outline: payload.outline,
      pathFormula: payload.pathFormula,
    };

    return element;
  };

  /**
   * 处理放置 Line 元素
   */
  const handleDropLine = (event: DragEvent): PPTLineElement | null => {
    if (!event.dataTransfer) return null;

    const raw = event.dataTransfer.getData(MIME_TYPE_MAP.line);
    if (!raw) return null;

    event.preventDefault();
    const payload = JSON.parse(raw) as LineDragData;
    const width = payload.width ?? 200;
    const height = payload.height ?? 2;
    const position = calculateDropPosition(event, width, height);

    const element: PPTLineElement = {
      id: uuid(),
      type: 'line',
      left: position.left,
      top: position.top,
      width,
      start: payload.start ?? [0, 0],
      end: payload.end ?? [200, 0],
      style: payload.style ?? 'solid',
      color: payload.color ?? '#000000',
      points: payload.points ?? ['', ''],
    };

    return element;
  };

  /**
   * 统一的放置处理 - 在 drop 事件中使用
   * 自动识别拖拽类型并创建对应元素
   */
  const handleDrop = (event: DragEvent): PPTElement | null => {
    if (!event.dataTransfer) return null;

    // 按优先级尝试处理不同类型
    const handlers = [
      { mime: MIME_TYPE_MAP.shape, handler: handleDropShape },
      { mime: MIME_TYPE_MAP.line, handler: handleDropLine },
    ];

    for (const { mime, handler } of handlers) {
      if (event.dataTransfer.types.includes(mime)) {
        const element = handler(event);
        if (element) {
          addElement(element);
          return element;
        }
      }
    }

    return null;
  };

  return {
    startDrag,
    allowDrop,
    handleDrop,
    handleDropShape,
    handleDropLine,
    calculateDropPosition,
  };
};
