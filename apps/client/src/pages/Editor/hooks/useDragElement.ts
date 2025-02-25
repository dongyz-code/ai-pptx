import { computed, toRefs, type Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { arrObject } from '@/utils';
import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';
import { getRectRotateRange, uniqueAlignLines } from '../utils';

import type { AlignmentLineProps, PPTElement, AlignLine } from '@/types';

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
  const { selectedElementIds, viewportSize, viewportRatio, viewportScale } = toRefs(editorStore.editorState);

  const elementList = computed(() => slidesStore.state.slides[slidesStore.state.sliderIndex]?.elements || []);

  const onInitDragElement = (e: MouseEvent, element: PPTElement) => {
    /** 非选中元素不处理 */
    if (!selectedElementIds.value.includes(element.id)) return;

    /** 是否是鼠标按下状态 */
    let isMouseDown = true;
    /** 视口宽度 */
    const edgeWidth = viewportSize.value;
    /** 视口高度 */
    const edgeHeight = viewportSize.value * viewportRatio.value;
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
    const originLeft = element.left;
    const originTop = element.top;
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

    console.log('horizontalLines:', horizontalLines);
    console.log('verticalLines:', verticalLines);

    const onMouseMove = (e: MouseEvent) => {
      const currentPageX = e.pageX;
      const currentPageY = e.pageY;
      console.log('currentPageX:', currentPageX, 'currentPageY:', currentPageY);

      /** 鼠标滑动距离较小，判定为误操作 */
      if (isMisoperation !== false) {
        isMisoperation =
          Math.abs(currentPageX - startPageX) < sorptionRange && Math.abs(currentPageY - startPageY) < sorptionRange;
      }

      if (!isMouseDown || isMisoperation) return;

      let moveX = (currentPageX - startPageX) / viewportScale.value;
      let moveY = (currentPageY - startPageY) / viewportScale.value;
      const targetLeft = originLeft + moveX;
      const targetTop = originTop + moveY;

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
       * 收集目标元素的四个边界
       * 需要区分单选和多选两种情况，其中多选状态下需要计算多选元素的整体范围；单选状态下需要继续区分线条、普通元素、旋转后的普通元素三种情况
       */
      let minX, maxX, minY, maxY;
      if (selectedElementIds.value.length === 1) {
        if (originRotate) {
          const { x1, x2, y1, y2 } = getRectRotateRange({
            left: targetLeft,
            top: targetTop,
            width: originWidth,
            height: originHeight,
            rotate: originRotate,
          });
          minX = x1;
          maxX = x2;
          minY = y1;
          maxY = y2;
        } else if (element.type === 'line') {
          minX = targetLeft;
          maxX = targetLeft + Math.max(element.start[0], element.end[0]);
          minY = targetTop;
          maxY = targetLeft + Math.max(element.start[1], element.end[1]);
        } else {
          minX = targetLeft;
          maxX = targetLeft + originWidth;
          minY = targetTop;
          maxY = targetTop + originHeight;
        }
      } else {
        const leftValues = [];
        const rightValues = [];
        const topValues = [];
        const bottomValues = [];
        for (const item of selectedElementList) {
          if ('rotate' in item && item.rotate) {
            const { x1, x2, y1, y2 } = getRectRotateRange(item);
            leftValues.push(x1);
            rightValues.push(x2);
            topValues.push(y1);
            bottomValues.push(y2);
          } else if (item.type === 'line') {
            leftValues.push(item.start[0], item.end[0]);
            topValues.push(item.start[1], item.end[1]);
            rightValues.push(item.start[0], item.end[0]);
            bottomValues.push(item.start[1], item.end[1]);
          } else {
            leftValues.push(item.left);
            topValues.push(item.top);
            rightValues.push(item.left + item.width);
            bottomValues.push(item.top + item.height);
          }
        }
        minX = Math.min(...leftValues);
        maxX = Math.max(...rightValues);
        minY = Math.min(...topValues);
        maxY = Math.max(...bottomValues);
      }

      const centerX = minX + (maxX - minX) / 2;
      const centerY = minY + (maxY - minY) / 2;

      /**
       * 将收集到的吸附线与目标元素的位置做对比，如果小于设定的差值，自动对齐
       * 1. 先判断水平方向是否吸附
       * 2. 再判断垂直方向是否吸附
       */
      const _alignmentLineList: AlignmentLineProps[] = [];

      for (const line of horizontalLines) {
        const { value, range } = line;
        const min = Math.min(...range, minX, maxX);
        const max = Math.max(...range, minX, maxX);

        if (Math.abs(minY - value) < sorptionRange) {
          moveY = moveY + (minY - value);
          console.log('minY:', minY.toFixed(2), 'value:', value.toFixed(2), Math.abs(minY - value).toFixed(2));
          _alignmentLineList.push({ type: 'horizontal', axis: { x: min - 50, y: value }, length: max - min + 100 });
          break;
        }

        if (Math.abs(maxY - value) < sorptionRange) {
          moveY = moveY - (maxY - value);
          _alignmentLineList.push({ type: 'horizontal', axis: { x: min - 50, y: value }, length: max - min + 100 });
          break;
        }

        if (Math.abs(centerY - value) < sorptionRange) {
          moveX = moveX - (centerY - value);
          _alignmentLineList.push({ type: 'horizontal', axis: { x: min - 50, y: value }, length: max - min + 100 });
          break;
        }
      }

      for (const line of verticalLines) {
        const { value, range } = line;
        const min = Math.min(...range, minY, maxY);
        const max = Math.max(...range, minY, maxY);

        if (Math.abs(minX - value) < sorptionRange) {
          moveX = moveX - (minX - value);
          _alignmentLineList.push({ type: 'vertical', axis: { x: value, y: min - 50 }, length: max - min + 100 });
          break;
        }

        if (Math.abs(maxX - value) < sorptionRange) {
          moveX = moveX - (maxX - value);
          _alignmentLineList.push({ type: 'vertical', axis: { x: value, y: min - 50 }, length: max - min + 100 });
          break;
        }

        if (Math.abs(centerX - value) < sorptionRange) {
          moveY = moveY - (centerX - value);
          _alignmentLineList.push({ type: 'vertical', axis: { x: value, y: min - 50 }, length: max - min + 100 });
          break;
        }
      }

      alignmentLineList.value = _alignmentLineList;

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
