import { defineComponent, computed, ref } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import { useDraggable } from '@vueuse/core';
import css from './index.module.css';

export default defineComponent({
  name: 'HoverOperator',
  setup() {
    const { editorState } = useEditor();
    const { state: slidesState, updateElement } = useSlides();

    const elementInfo = computed(() => {
      const hoverId = editorState.hoverElementId;
      const slide = slidesState.slides[slidesState.sliderIndex];
      const element = slide.elements.find((element) => element.id === hoverId);
      return element;
    });

    const hoverOperatorRef = ref<HTMLDivElement>();
    useDraggable(hoverOperatorRef, {
      initialValue: { x: elementInfo.value?.left || 0, y: elementInfo.value?.top || 0 },
      onMove(position) {
        if (!elementInfo.value?.id) return;
        const { x, y } = position;
        console.log(x, y);
        updateElement({
          id: elementInfo.value?.id,
          props: {
            left: x,
            top: y,
          },
        });
      },
    });

    return () =>
      elementInfo.value && (
        <div
          onClick={(e) => alert(1)}
          ref={hoverOperatorRef}
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
