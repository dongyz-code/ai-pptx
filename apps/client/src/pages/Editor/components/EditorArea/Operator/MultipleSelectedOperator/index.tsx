import { defineComponent, computed } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import css from './index.module.css';
import { arrObject } from '@/utils';
import { getElementsRange } from '@/pages/Editor/utils';

export default defineComponent({
  name: 'MultipleSelectedOperator',
  setup() {
    const { editorState } = useEditor();
    const { state: slidesState } = useSlides();

    /** 计算选中元素的包围盒 需要考虑旋转 */
    const wrapperRect = computed(() => {
      if (editorState.selectedElementIds?.length <= 1) {
        return null;
      }

      const selectIdMap = arrObject(editorState.selectedElementIds);
      const slide = slidesState.slides[slidesState.sliderIndex];
      const elements = slide.elements.filter((element) => selectIdMap[element.id]);
      const { x1, x2, y1, y2 } = getElementsRange(elements);
      return {
        width: x2 - x1,
        height: y2 - y1,
        left: x1,
        top: y1,
      };
    });

    return () =>
      wrapperRect.value && (
        <div
          class={css['hover-operator']}
          style={{
            position: 'absolute',
            width: `${wrapperRect.value.width}px`,
            height: `${wrapperRect.value.height}px`,
            left: `${wrapperRect.value.left}px`,
            top: `${wrapperRect.value.top}px`,
          }}
        ></div>
      );
  },
});
