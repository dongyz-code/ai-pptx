import { computed, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useSlides, useEditor } from '@/pages/Editor/models';

import { AlignmentLineProps, PPTElement } from '@/types';

export function useDragElement() {
  const editorStore = useEditor();
  const slidesStore = useSlides();

  const elementList = computed(() => slidesStore.state.slides[slidesStore.state.sliderIndex]?.elements || []);
  const selectedElementIds = computed(() => editorStore.editorState.selectedElementIds);

  const ondDragElement = (e: MouseEvent, element: PPTElement) => {
    /** 非选中元素不处理 */
    if (!selectedElementIds.value.includes(element.id)) return;
  };

  return {
    ondDragElement,
  };
}
