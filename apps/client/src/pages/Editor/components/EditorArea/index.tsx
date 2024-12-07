import { defineComponent, computed, ref } from 'vue';
import { useEditor, useSlides } from '../../models';
import { useViewportSize } from '../../hooks';

import EditorElement from './EditorElement';

import type { Slide } from '@/types';

const EditorArea = defineComponent({
  name: 'EditorArea',
  setup() {
    const wrapperRef = ref<HTMLDivElement>();
    const { editorState } = useEditor();
    const { state } = useSlides();
    const { positionStyle } = useViewportSize(wrapperRef);

    const currentSlide = computed(() => state.slides[state.sliderIndex]);

    return () => (
      <div class="editor-wrapper relative" ref={wrapperRef}>
        <div class="canvas absolute transform-gpu shadow" style={positionStyle.value}>
          {currentSlide.value.elements.map((element) => (
            <EditorElement element={element} key={element.id} />
          ))}
        </div>
      </div>
    );
  },
});

export default EditorArea;
