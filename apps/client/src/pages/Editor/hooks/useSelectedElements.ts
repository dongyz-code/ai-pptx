import { computed } from 'vue';
import { useEditor, useSlides } from '../models';
import { arrObject } from '@/utils';

export const useSelectedElements = () => {
  const { editorState } = useEditor();
  const { state: slideState } = useSlides();

  const selectedElements = computed(() => {
    const selectedIdMap = arrObject(editorState.selectedElementIds);
    const index = slideState.sliderIndex;
    const slideElements = slideState.slides[index].elements;
    return slideElements.filter((element) => selectedIdMap[element.id]);
  });

  return {
    selectedElements,
  };
};
