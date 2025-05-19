import { computed, toRefs, type Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { arrObject } from '@/utils';
import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';
import { getRectRotateRange, uniqueAlignLines } from '../utils';
import { OPERATE_RESIZE_HANDLERS } from '@/constants';

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

    const onMouseMove = (e: MouseEvent) => {};

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
