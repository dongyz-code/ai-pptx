import { defineComponent, computed } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import { arrObject } from '@/utils';
import css from './index.module.css';

export default defineComponent({
  name: 'SelectedOperator',
  setup() {
    const { editorState } = useEditor();
    const { state: slidesState } = useSlides();

    const elementsInfo = computed(() => {
      if (!editorState.selectedElementIds.length) return [];

      const selectIdMap = arrObject(editorState.selectedElementIds);
      const slide = slidesState.slides[slidesState.sliderIndex];
      const elements = slide.elements.filter((element) => selectIdMap[element.id]);
      if (!elements?.length) return [];

      return elements.map((element) => {
        const { width, left, top } = element;
        let height = 0;
        let rotate = 0;

        if ('height' in element) {
          height = element.height;
        }

        if ('rotate' in element) {
          rotate = element.rotate;
        }

        return {
          width,
          height,
          left,
          top,
          rotate,
        };
      });
    });

    return () =>
      elementsInfo.value.map((e) => (
        <div
          class={css['hover-operator']}
          style={{
            position: 'absolute',
            width: `${e.width}px`,
            height: `${e.height || 0}px`,
            left: `${e.left}px`,
            top: `${e.top}px`,
            transform: `rotate(${e.rotate}deg)`,
          }}
        ></div>
      ));
  },
});
