import { computed, toRefs, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { arrObject } from '@/utils';

import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';

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

    const originLeft = element.left;
    const originTop = element.top;
    const originWidth = element.width;
    const originHeight = 'height' in element && element.height ? element.height : 0;
    const originRotate = 'rotate' in element && element.rotate ? element.rotate : 0;
    const startPageX = e.pageX;
    const startPageY = e.pageY;

    /**
     * @TODO
     * 收集吸附线
     */
    let horizontalLines: AlignLine[] = [];
    let verticalLines: AlignLine[] = [];

    for (const item of selectedElementList) {
      // 线条元素不参与
      if (item.type === 'line') continue;
      if (item.id === element.id) continue;

      horizontalLines = [];
      verticalLines = [];
      console.log(horizontalLines);
      console.log(verticalLines);
    }

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

      if (keyboardStore.keyboardState.isShiftKey) {
        if (Math.abs(moveX) < Math.abs(moveY)) {
          moveX = 0;
        }
        if (Math.abs(moveX) > Math.abs(moveY)) {
          moveY = 0;
        }
      }

      const newLeft = originLeft + moveX;
      const newTop = originTop + moveY;

      /**
       * @TODO
       * 处理吸附情况
       */

      const newElementList = elementList.value.map((item) => {
        if (selectedIdMap[item.id]) {
          return {
            ...item,
            left: newLeft,
            top: newTop,
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
