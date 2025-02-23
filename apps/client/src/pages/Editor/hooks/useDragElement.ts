import { computed, toRefs, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { arrObject } from '@/utils';

import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';

import type { AlignmentLineProps, PPTElement, AlignLine } from '@/types';
import { getRectRotateRange, uniqueAlignLines } from '../utils';

/**
 * 拖拽元素
 * 1. 拖拽元素时，计算拖拽元素的吸附范围
 * 2. 收集对齐对齐吸附线
 * 3. 由于拖拽的并不是一个元素， 所以把拖拽事件绑定到body上
 */
export function useDragElement(alignmentLineList: Ref<AlignmentLineProps[]>) {
  const editorStore = useEditor();
  const slidesStore = useSlides();
  const keyboardStore = useKeyboard();
  const { selectedElementIds, viewportSize, viewportScale } = toRefs(editorStore.editorState);

  const elementList = computed(() => slidesStore.state.slides[slidesStore.state.sliderIndex]?.elements || []);

  const onInitDragElement = (e: MouseEvent, element: PPTElement) => {
    /** 非选中元素不处理 */
    if (!selectedElementIds.value.includes(element.id)) return;

    /** 是否是鼠标按下状态 */
    let isMouseDown = true;
    /** 视口宽度 */
    const edgeWidth = viewportSize.value;
    /** 视口高度 */
    const edgeHeight = viewportSize.value * viewportScale.value;
    /** 误操作范围 */
    const sorptionRange = 5;
    /** 是否是误操作 */
    let isMisoperation: boolean | null = null;

    const selectedIdMap = arrObject(selectedElementIds.value);
    const originElementList = cloneDeep(elementList.value);
    const selectedElementList = originElementList.filter((item) => selectedIdMap[item.id]);

    const originWidth = element.width;
    const originHeight = 'height' in element && element.height ? element.height : 0;
    const originRotate = 'rotate' in element && element.rotate ? element.rotate : 0;
    const startPageX = e.pageX;
    const startPageY = e.pageY;

    /**
     * 收集各元素吸附线
     */
    let horizontalLines: AlignLine[] = [];
    let verticalLines: AlignLine[] = [];
    for (const item of elementList.value) {
      // 线条元素不参与
      if (item.type === 'line') continue;
      if (item.id === element.id) continue;

      let left, top, width, height;
      if ('route' in item && item.rotate) {
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

    /**
     * 画布区域吸附线(四个角)
     */
    const edgeTopLeftLine: AlignLine = { value: 0, range: [0, edgeWidth] };
    const edgeTopRightLine: AlignLine = { value: 0, range: [0, edgeHeight] };
    const edgeBottomLeftLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] };
    const edgeBottomRightLine: AlignLine = { value: edgeHeight, range: [0, edgeHeight] };

    horizontalLines.push(edgeTopLeftLine, edgeTopRightLine);
    verticalLines.push(edgeBottomLeftLine, edgeBottomRightLine);

    /**吸附线去重 */
    horizontalLines = uniqueAlignLines(horizontalLines);
    verticalLines = uniqueAlignLines(verticalLines);

    const onMouseMove = (e: MouseEvent) => {
      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      /** 鼠标滑动距离较小，判定为误操作 */
      if (isMisoperation !== false) {
        isMisoperation =
          Math.abs(currentPageX - startPageX) < sorptionRange && Math.abs(currentPageY - startPageY) < sorptionRange;
      }

      if (!isMouseDown || isMisoperation) return;

      let moveX = currentPageX - startPageX;
      let moveY = currentPageY - startPageY;

      /** 按住shift，水平/垂直移动 */
      if (keyboardStore.keyboardState.isShiftKey) {
        if (Math.abs(moveX) < Math.abs(moveY)) {
          moveX = 0;
        }
        if (Math.abs(moveX) > Math.abs(moveY)) {
          moveY = 0;
        }
      }

      /**
       * @TODO
       * 处理吸附情况
       */

      const newElementList = originElementList.map((item) => {
        if (selectedIdMap[item.id]) {
          return {
            ...item,
            left: item.left + moveX,
            top: item.top + moveY,
          };
        } else {
          return item;
        }
      });

      slidesStore.setElements(newElementList);
    };

    const onMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);

      alignmentLineList.value = [];

      //
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    onInitDragElement,
  };
}
