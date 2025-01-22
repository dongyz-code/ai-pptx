import { defineComponent, computed, ref } from 'vue';
import { useEditor, useSlides } from '../../models';
import { useViewportSize, useDragElement, useSelectElement } from '../../hooks';

import EditorElement from './EditorElement';
import CommonOperator from './Operator/CommonOperator';

import type { AlignmentLineProps, Slide } from '@/types';

const EditorArea = defineComponent({
  name: 'EditorArea',
  setup() {
    const wrapperRef = ref<HTMLDivElement>();
    const { editorState } = useEditor();
    const { state } = useSlides();
    const alignmentLineList = ref<AlignmentLineProps[]>([]);
    const { positionStyle } = useViewportSize(wrapperRef);
    const { onInitDragElement } = useDragElement(alignmentLineList);
    const { ondSelectElement } = useSelectElement(onInitDragElement);

    const currentSlide = computed(() => state.slides[state.sliderIndex]);

    return () => (
      <div class="editor-wrapper relative" ref={wrapperRef}>
        <div class="canvas absolute transform-gpu shadow-lg" style={positionStyle.value}>
          <div
            class="viewport absolute left-0 top-0 origin-top-left"
            style={{ transform: `scale(${editorState.viewportScale})` }}
          >
            {currentSlide.value.elements.map((element, index) => (
              <EditorElement key={element.id} element={element} zIndex={index + 1} selectElement={ondSelectElement} />
            ))}
          </div>
        </div>

        <div class="pointer-events-none absolute transform-gpu" style={positionStyle.value}>
          <div
            class="absolute left-0 top-0 origin-top-left"
            style={{ transform: `scale(${editorState.viewportScale})` }}
          >
            <CommonOperator />
          </div>
        </div>
      </div>
    );
  },
});

export default EditorArea;
