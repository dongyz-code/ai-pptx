import { toRefs, type Ref } from 'vue';
import { useSlides, useEditor, useKeyboard } from '@/pages/ppt-editor/models';
import { getCurrentPoint, getOppositePoint, getRectElementPoint } from '../utils';
import { MIN_SIZE, OPERATE_RESIZE_HANDLERS } from '@/constants';

import type { AlignmentLineProps, PPTElement, PPTLineElement } from '@/types';

export function useScaleElement(_alignmentLineList: Ref<AlignmentLineProps[]>) {
  const slidesStore = useSlides();
  const editorStore = useEditor();
  void _alignmentLineList;

  const { selectedElementIds, viewportScale } = toRefs(editorStore.editorState);

  const scaleElement = (
    e: MouseEvent,
    element: Exclude<PPTElement, PPTLineElement>,
    command: OPERATE_RESIZE_HANDLERS
  ) => {
    /** 非选中元素不处理 */
    if (!selectedElementIds.value.includes(element.id)) return;

    const { ctrlOrShiftKeyActive } = useKeyboard();

    // 定义一个变量，用于判断鼠标是否按下
    let isMouseDown = true;
    editorStore.setIsScaling(true);
    const originWidth = element.width;
    const originHeight = 'height' in element && element.height ? element.height : 0;
    const originRotate = 'rotate' in element && element.rotate ? element.rotate : 0;
    const rotateRadian = (originRotate * Math.PI) / 180;
    const originLeft = element.left;
    const originTop = element.top;
    const startPageX = e.pageX;
    const startPageY = e.pageY;
    let rafId: number | null = null;
    let latestPageX = startPageX;
    let latestPageY = startPageY;

    // 元素最小缩放限制
    const minSize = MIN_SIZE[element.type] ?? 20;

    const getSizeWithinRange = (size: number, type: 'width' | 'height') => {
      if (!fixedRatio) return size < minSize ? minSize : size;

      let minWidth = minSize;
      let minHeight = minSize;
      const ratio = element.width / element.height;
      if (ratio < 1) minHeight = minSize / ratio;
      if (ratio > 1) minWidth = minSize * ratio;

      if (type === 'width') return size < minWidth ? minWidth : size;
      return size < minHeight ? minHeight : size;
    };

    const fixedRatio = ctrlOrShiftKeyActive || ('fixedRatio' in element && element.fixedRatio);
    const aspectRatio = originWidth / originHeight;

    /**
     *  1: 算出操作点和对角基点
     */
    const points = getRectElementPoint(element);
    const basePoint = getOppositePoint(command, points);
    const dragPoint = getCurrentPoint(command, points);

    const applyMove = (currentPageX: number, currentPageY: number) => {
      if (!isMouseDown) {
        return;
      }

      let width = originWidth;
      let height = originHeight;
      let left = originLeft;
      let top = originTop;

      const moveX = (currentPageX - startPageX) / viewportScale.value;
      let moveY = (currentPageY - startPageY) / viewportScale.value;

      /**
       * 元素在被旋转的情况下，需要根据元素旋转的角度，重新计算元素缩放的距离
       */
      if (originRotate) {
        /**
         * 2：拖动后新顶点位置
         */
        const newDragPoint = {
          x: dragPoint.x + moveX,
          y: dragPoint.y + moveY,
        };

        /**
         * 3: 定义局部坐标系
         */
        const cosA = Math.cos(rotateRadian);
        const sinA = Math.sin(rotateRadian);
        const u = { x: cosA, y: sinA }; // 宽方向
        const v = { x: -sinA, y: cosA }; // 高方向

        /**
         * 4: 投影到局部坐标系，算宽高
         */
        const vec = { x: newDragPoint.x - basePoint.x, y: newDragPoint.y - basePoint.y };
        const newWidth = Math.abs(vec.x * u.x + vec.y * u.y);
        const newHeight = Math.abs(vec.x * v.x + vec.y * v.y);

        /**
         * 5: 根据操作点，算出缩放后的宽高
         * 角点会影响宽和高
         * 中点仅会影响其中的一个
         */
        switch (command) {
          case OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM:
          case OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM:
          case OPERATE_RESIZE_HANDLERS.LEFT_TOP:
          case OPERATE_RESIZE_HANDLERS.RIGHT_TOP:
            width = getSizeWithinRange(newWidth, 'width');
            height = getSizeWithinRange(newHeight, 'height');
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT:
          case OPERATE_RESIZE_HANDLERS.RIGHT:
            width = getSizeWithinRange(newWidth, 'width');
            break;
          case OPERATE_RESIZE_HANDLERS.TOP:
          case OPERATE_RESIZE_HANDLERS.BOTTOM:
            height = getSizeWithinRange(newHeight, 'height');
            break;
        }

        /**
         * 6: 保持基点不变，反推left top
         */
        const newPoints = getRectElementPoint({
          width,
          height,
          left: 0,
          top: 0,
          rotate: originRotate,
        });
        const newOpposite = getOppositePoint(command, newPoints);

        /** 基点偏移修正 */
        left = basePoint.x - newOpposite.x;
        top = basePoint.y - newOpposite.y;
      } else {
        /**
         * 元素未被旋转的情况下，直接根据操作点计算缩放后的大小和位置
         */
        if (fixedRatio) {
          if (
            command === OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM ||
            command === OPERATE_RESIZE_HANDLERS.LEFT_TOP
          ) {
            moveY = moveY / aspectRatio;
          } else if (
            command === OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM ||
            command === OPERATE_RESIZE_HANDLERS.RIGHT_TOP
          ) {
            moveY = -moveY / aspectRatio;
          }
        }

        switch (command) {
          case OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM:
            width = getSizeWithinRange(originWidth + moveX, 'width');
            height = getSizeWithinRange(originHeight + moveY, 'height');
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM:
            width = getSizeWithinRange(originWidth - moveX, 'width');
            height = getSizeWithinRange(originHeight + moveY, 'height');
            left = originLeft - (width - originWidth);
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT_TOP:
            width = getSizeWithinRange(originWidth - moveX, 'width');
            height = getSizeWithinRange(originHeight - moveY, 'height');
            left = originLeft - (width - originWidth);
            top = originTop - (height - originHeight);
            break;
          case OPERATE_RESIZE_HANDLERS.RIGHT_TOP:
            width = getSizeWithinRange(originWidth + moveX, 'width');
            height = getSizeWithinRange(originHeight - moveY, 'height');
            top = originTop - (height - originHeight);
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT:
            width = getSizeWithinRange(originWidth - moveX, 'width');
            left = originLeft - (width - originWidth);
            break;
          case OPERATE_RESIZE_HANDLERS.RIGHT:
            width = getSizeWithinRange(originWidth + moveX, 'width');
            break;
          case OPERATE_RESIZE_HANDLERS.TOP:
            height = getSizeWithinRange(originHeight - moveY, 'height');
            top = originTop - (height - originHeight);
            break;
          case OPERATE_RESIZE_HANDLERS.BOTTOM:
            height = getSizeWithinRange(originHeight + moveY, 'height');
            break;
          default:
            break;
        }
      }

      slidesStore.updateElement({
        id: element.id,
        props: {
          width,
          height,
          left,
          top,
          rotate: originRotate,
        },
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      latestPageX = e.pageX;
      latestPageY = e.pageY;

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyMove(latestPageX, latestPageY);
      });
    };

    const onMouseUp = () => {
      isMouseDown = false;
      editorStore.setIsScaling(false);
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    scaleElement,
  };
}
