import { computed } from 'vue';
import { arrObject, unique } from '@/utils';
import { useSlides, useEditor, useKeyboard } from '@/pages/Editor/models';

import type { PPTElement } from '@/types';

export function useSelectElement(dragElement: (e: MouseEvent | TouchEvent, element: PPTElement) => void) {
  const editorStore = useEditor();
  const slidesStore = useSlides();
  const { keyboardState } = useKeyboard();

  const selectedIdMap = computed(() => arrObject(editorStore.editorState.selectedElementIds));

  const ondSelectElement = (e: MouseEvent | TouchEvent, element: PPTElement, startMove = true) => {
    const currentSlide = slidesStore.state.slides[slidesStore.state.sliderIndex];
    const isCtrlOrShift = keyboardState.isShiftKey || keyboardState.isCtrlKey;

    if (selectedIdMap.value[element.id]) {
      /**
       * 如果元素未被选中，则将元素设置为选中状态
       * 1. 如果按下 shift 或 ctrl 键, 进入多选状态 则将元素添加到选中状态
       * 2. 如果目标是分组成员，需要将分组其他元素也设置为选中状态
       * 3. 否则仅将该元素设置于选中状态，并取消其他元素的选中状态
       */

      let newIds: string[] = [];
      if (isCtrlOrShift) {
        newIds = [...editorStore.editorState.selectedElementIds, element.id];
      } else {
        newIds = [element.id];
      }

      if (element.groupId) {
        const list = currentSlide.elements.filter((item) => item.groupId === element.groupId);
        newIds = [...newIds, ...list.map((item) => item.id)];
      }

      newIds = unique(newIds);
      editorStore.setSelectedElementIds(newIds);
    } else if (isCtrlOrShift) {
      /**
       * 1. 如果元素已被选中，且按下了Ctrl键或Shift键，则取消选中状态
       * 2. 如果目标元素是分组成员，需要将该组合的其他元素一起取消选中状态
       */

      let newIds: string[] = [];
      if (element.groupId) {
        const list = currentSlide.elements.filter((item) => item.groupId === element.groupId);
        const map = arrObject(list.map((item) => item.id));
        newIds = editorStore.editorState.selectedElementIds.filter((id) => !map[id]);
      } else {
        newIds = editorStore.editorState.selectedElementIds.filter((id) => id !== element.id);
      }

      newIds = unique(newIds);
      editorStore.setSelectedElementIds(newIds);
    }

    if (startMove) {
      dragElement(e, element);
    }
  };

  return {
    ondSelectElement,
  };
}
