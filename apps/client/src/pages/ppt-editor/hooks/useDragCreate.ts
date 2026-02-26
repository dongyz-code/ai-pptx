import { useEditor, useSlides } from '../models';
import { uuid } from '@/utils';

import type { PPTElement } from '@/types';

const DRAG_MIME = 'application/x-ppt-element';

/**
 * 开始拖拽 — 纯工具函数，不是 hook。
 * payload 应该是完整的元素模板（不含 id / left / top），
 * drop 端会自动补上这三个字段。
 */
export function startElementDrag(event: DragEvent, payload: Partial<PPTElement>, label?: string) {
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
  if (label) {
    event.dataTransfer.setData('text/plain', label);
  }
}

/**
 * 画布 drop 端 hook，仅在 Canvas 中调用一次。
 * 完全通用：不关心元素类型，只负责计算落点并补 id / left / top。
 */
export const useDragCreate = () => {
  const { editorState } = useEditor();
  const { addElement } = useSlides();

  const allowDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    if (event.dataTransfer.types.includes(DRAG_MIME)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return null;

    const raw = event.dataTransfer.getData(DRAG_MIME);
    if (!raw) return null;

    event.preventDefault();
    const payload = JSON.parse(raw);

    // 线条的 width 是线宽（stroke-width），视觉尺寸由 start/end/控制点 决定
    let w: number;
    let h: number;
    if (Array.isArray(payload.start) && Array.isArray(payload.end)) {
      const allPoints: [number, number][] = [payload.start, payload.end];
      if (payload.broken) allPoints.push(payload.broken);
      if (payload.broken2) allPoints.push(payload.broken2);
      if (payload.curve) allPoints.push(payload.curve);
      if (payload.cubic) allPoints.push(...payload.cubic);

      const xs = allPoints.map((p: [number, number]) => p[0]);
      const ys = allPoints.map((p: [number, number]) => p[1]);
      w = Math.max(...xs) - Math.min(...xs);
      h = Math.max(...ys) - Math.min(...ys);
    } else {
      w = payload.width ?? 200;
      h = payload.height ?? 0;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const scale = editorState.viewportScale;

    const element: PPTElement = {
      ...payload,
      id: uuid(),
      left: (event.clientX - rect.left) / scale - w / 2,
      top: (event.clientY - rect.top) / scale - h / 2,
    };

    addElement(element);
    return element;
  };

  return { allowDrop, handleDrop };
};
