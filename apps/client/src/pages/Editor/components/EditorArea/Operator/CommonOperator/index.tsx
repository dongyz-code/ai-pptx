import { defineComponent, computed } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import css from './index.module.css';

export default defineComponent({
  name: 'HoverOperator',
  setup() {
    const { editorState } = useEditor();
    const { state: slidesState } = useSlides();

    const elementInfo = computed(() => {
      const hoverId = editorState.hoverElementId;
      const slide = slidesState.slides[slidesState.sliderIndex];
      const element = slide.elements.find((element) => element.id === hoverId);
      if (!element) return null;

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

    return () =>
      elementInfo.value && (
        <div
          class={css['hover-operator']}
          style={{
            position: 'absolute',
            width: `${elementInfo.value.width}px`,
            height: `${elementInfo.value.height || 0}px`,
            left: `${elementInfo.value.left}px`,
            top: `${elementInfo.value.top}px`,
            transform: `rotate(${elementInfo.value.rotate}deg)`,
          }}
        ></div>
      );
  },
});
