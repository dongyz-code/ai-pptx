import { computed, toRefs, type Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { arrObject, getKeys } from '@/utils';
import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';
import { collectAlignLines, getOppositePoint, getRectElementPoint, uniqueAlignLines } from '../utils';
import { MIN_SIZE, OPERATE_RESIZE_HANDLERS } from '@/constants';

import type { AlignmentLineProps, PPTElement, AlignLine, PPTLineElement } from '@/types';

export function useScaleElement(elements: Ref<PPTElement[]>, alignmentLineList: Ref<AlignmentLineProps[]>) {
  const slidesStore = useSlides();
  const editorStore = useEditor();

  const { selectedElementIds, viewportSize, viewportScale, viewportRatio } = toRefs(editorStore.editorState);
  const elementList = computed(() => slidesStore.state.slides[slidesStore.state.sliderIndex]?.elements || []);

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
    /** 视口宽度 */
    const edgeWidth = viewportSize.value;
    /** 视口高度 */
    const edgeHeight = viewportSize.value / viewportRatio.value;

    const selectedIdMap = arrObject(selectedElementIds.value);
    const originElementList = cloneDeep(elements.value);
    const selectedElementList = originElementList.filter((item) => selectedIdMap[item.id]);

    const originWidth = element.width;
    const originHeight = 'height' in element && element.height ? element.height : 0;
    const originRotate = 'rotate' in element && element.rotate ? element.rotate : 0;
    const rotateRadian = (originRotate * Math.PI) / 180;
    const originLeft = element.left;
    const originTop = element.top;
    const startPageX = e.pageX;
    const startPageY = e.pageY;

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

    const { horizontalLines, verticalLines } = collectAlignLines({
      elementList: elementList.value?.filter((item) => item.id !== element.id),
      edgeWidth,
      edgeHeight,
    });
    let basePoint = { x: 0, y: 0 };

    /** 以操作的缩放点相对的点为基点，计算旋转后的基点真实坐标 */
    if ('rotate' in element && element.rotate) {
      const points = getRectElementPoint(element);
      basePoint = getOppositePoint(command, points);
    }

    const onMouseMove = (e: MouseEvent) => {
      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      let width = originWidth;
      let height = originHeight;
      let left = originLeft;
      let top = originTop;

      if (!isMouseDown) {
        return;
      }

      let moveX = (currentPageX - startPageX) / viewportScale.value;
      let moveY = (currentPageY - startPageY) / viewportScale.value;

      /**
       * 元素在被旋转的情况下，需要根据元素旋转的角度，重新计算元素缩放的距离
       */
      if (originRotate) {
        let revisedX = Math.cos(rotateRadian) * moveX - Math.sin(rotateRadian) * moveY;
        let revisedY = Math.sin(rotateRadian) * moveX + Math.cos(rotateRadian) * moveY;

        /**
         * 锁定宽高比例（仅四个角可能触发，四条边不会触发）
         * 以水平方向上缩放的距离为基础，计算垂直方向上的缩放距离，保持二者具有相同的缩放比例
         */
        if (fixedRatio) {
          if (command === OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM || command === OPERATE_RESIZE_HANDLERS.LEFT_TOP) {
            revisedY = revisedY / aspectRatio;
          } else if (command === OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM || command === OPERATE_RESIZE_HANDLERS.RIGHT_TOP) {
            revisedY = -revisedY / aspectRatio;
          }
        }

        /**
         * 根据不同的操作点分别计算缩放后的大小和位置
         * 注意：
         *
         * 1. 此处计算的位置需要在后面重新进行校正，因为旋转后再缩放事实上会改变元素基点的位置
         *    （虽然视觉上基点保持不动，但这是【旋转】+【移动】共同作用的结果）
         * 2. 但此处计算的大小不需要重新校正，因为前面已经重新计算需要缩放的距离，相当于大小已经经过了校正
         */
        switch (command) {
          case OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM:
            width = getSizeWithinRange(originWidth + revisedX, 'width');
            height = getSizeWithinRange(originHeight + revisedY, 'height');
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT_TOP:
            width = getSizeWithinRange(originWidth - revisedX, 'width');
            height = getSizeWithinRange(originHeight - revisedY, 'height');
            left = originLeft + revisedX;
            top = originTop + revisedY;
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM:
            width = getSizeWithinRange(originWidth - revisedX, 'width');
            height = getSizeWithinRange(originHeight + revisedY, 'height');
            top = originTop + revisedY;
            break;
          case OPERATE_RESIZE_HANDLERS.RIGHT_TOP:
            width = getSizeWithinRange(originWidth + revisedX, 'width');
            height = getSizeWithinRange(originHeight - revisedY, 'height');
            top = originTop - (height - originHeight);
            break;
          case OPERATE_RESIZE_HANDLERS.RIGHT:
            width = getSizeWithinRange(originWidth + revisedX, 'width');
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT:
            width = getSizeWithinRange(originWidth - revisedX, 'width');
            left = originLeft + revisedX;
            break;
          case OPERATE_RESIZE_HANDLERS.TOP:
            height = getSizeWithinRange(originHeight - revisedY, 'height');
            top = originTop + revisedY;
            break;
          case OPERATE_RESIZE_HANDLERS.BOTTOM:
            height = getSizeWithinRange(originHeight + revisedY, 'height');
            break;
          default:
            break;
        }

        /** 获取当前元素的基点坐标，与初始状态基点坐标进行对比，并计算差值进行元素位置的矫正 */
        const currentPoints = getRectElementPoint({ width, height, left, top, rotate: originRotate });
        const currentOppositePoint = getOppositePoint(command, currentPoints);
        const currentBaseLeft = currentOppositePoint.x;
        const currentBaseTop = currentOppositePoint.y;

        const offsetX = currentBaseLeft - basePoint.x;
        const offsetY = currentBaseTop - basePoint.y;

        left = originLeft - offsetX;
        top = originTop - offsetY;
      } else {
        /**
         * 元素未被旋转的情况下，直接根据操作点计算缩放后的大小和位置
         */

        if (fixedRatio) {
          if (command === OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM || command === OPERATE_RESIZE_HANDLERS.LEFT_TOP) {
            moveY = moveY / aspectRatio;
          } else if (command === OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM || command === OPERATE_RESIZE_HANDLERS.RIGHT_TOP) {
            moveY = -moveY / aspectRatio;
          }
        }

        switch (command) {
          case OPERATE_RESIZE_HANDLERS.RIGHT_BOTTOM:
            width = getSizeWithinRange(originWidth + moveX, 'width');
            height = getSizeWithinRange(originHeight + moveY, 'height');
            left = originLeft - (width - originWidth);
            break;
          case OPERATE_RESIZE_HANDLERS.LEFT_BOTTOM:
            width = getSizeWithinRange(originWidth + moveX, 'width');
            height = getSizeWithinRange(originHeight + moveY, 'height');
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

      const newElementList = elementList.value.map((item) => {
        if (item.id !== element.id) {
          return item;
        }

        return {
          ...item,
          width,
          height,
          left,
          top,
          rotate: originRotate,
        };
      });

      slidesStore.setElements(newElementList);
    };

    const onMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      editorStore.setIsScaling(false);
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    scaleElement,
  };
}
