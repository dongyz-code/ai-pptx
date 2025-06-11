import { computed, toRefs, type Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { arrObject, getKeys } from '@/utils';
import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';
import { getOppositePoint, getRectElementPoint, uniqueAlignLines } from '../utils';
import { MIN_SIZE, OPERATE_RESIZE_HANDLERS } from '@/constants';

import type { AlignmentLineProps, PPTElement, AlignLine } from '@/types';

export function useScaleElement(elements: Ref<PPTElement[]>, alignmentLineList: Ref<AlignmentLineProps[]>) {
  const slidesStore = useSlides();
  const editorStore = useEditor();

  const { selectedElementIds, viewportSize, viewportScale, viewportRatio } = toRefs(editorStore.editorState);

  // 定义一个函数，用于缩放元素
  const scaleElement = (e: MouseEvent, element: PPTElement, command: OPERATE_RESIZE_HANDLERS) => {
    /** 非选中元素不处理 */
    if (!selectedElementIds.value.includes(element.id)) return;

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
    const originLeft = element.left;
    const originTop = element.top;
    const startPageX = e.pageX;
    const startPageY = e.pageY;

    // 元素最小缩放限制
    const minSize = MIN_SIZE[element.type] ?? 20;

    let basePoint = { x: originLeft, y: originTop };
    let horizontalLines: AlignLine[] = [];
    let verticalLines: AlignLine[] = [];

    /** 以但概念操作的缩放点相对的点为基点，计算旋转后的基点真实坐标 */
    if ('rotate' in element && element.rotate) {
      const points = getRectElementPoint(element);
      basePoint = getOppositePoint(command, points);
    }

    const onMouseMove = (e: MouseEvent) => {
      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      if (!isMouseDown) {
        return;
      }

      let moveX = (currentPageX - startPageX) / viewportScale.value;
      let moveY = (currentPageY - startPageY) / viewportScale.value;
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
