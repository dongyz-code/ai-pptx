import { defineComponent, computed, ref } from 'vue';
import { useEditor, useSlides } from '../../models';
import { useViewportSize, useDragElement, useSelectElement } from '../../hooks';

import EditorElement from './EditorElement';
import HoverOperator from './Operator/HoverOperator';
import SelectedOperator from './Operator/SelectedOperator';
import MultipleSelectedOperator from './Operator/MultipleSelectedOperator';

import type { AlignmentLineProps } from '@/types';
import AlignmentLine from './AlignmentLine';

const EditorArea = defineComponent({
  name: 'EditorArea',
  setup() {
    const wrapperRef = ref<HTMLDivElement>();
    const { editorState, setHoverElementId, setIsCanvasFocus, setSelectedElementIds } = useEditor();
    const { state } = useSlides();
    const alignmentLineList = ref<AlignmentLineProps[]>([]);
    const { positionStyle } = useViewportSize(wrapperRef);
    const { onInitDragElement } = useDragElement(alignmentLineList);
    const { onSelectElement } = useSelectElement(onInitDragElement);

    const currentSlide = computed(() => state.slides[state.sliderIndex]);

    /** 点击空白区域: 清空选中元素，设置画布焦点 */
    const onClickBlankArea = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedElementIds([]);
        setIsCanvasFocus(true);
        setHoverElementId(null);
      }
    };

    /** 双击空白区域 */
    const onDoubleClickBlankArea = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
        setIsCanvasFocus(false);
      }
    };

    return () => (
      <div class="editor-wrapper relative" ref={wrapperRef}>
        <div
          id="editor-canvas"
          class="canvas absolute transform-gpu shadow-lg"
          style={positionStyle.value}
          onMousedown={onClickBlankArea}
          onDblclick={onDoubleClickBlankArea}
        >
          <div
            class="viewport absolute left-0 top-0 origin-top-left"
            style={{ transform: `scale(${editorState.viewportScale})` }}
          >
            {currentSlide.value.elements.map((element, index) => (
              <EditorElement key={element.id} element={element} zIndex={index + 1} selectElement={onSelectElement} />
            ))}
          </div>
        </div>

        <div class="pointer-events-none absolute transform-gpu" style={positionStyle.value}>
          <div
            class="absolute left-0 top-0 origin-top-left"
            style={{ transform: `scale(${editorState.viewportScale})` }}
          >
            <HoverOperator />
            <SelectedOperator />
            <MultipleSelectedOperator />

            {alignmentLineList.value.map((line, index) => (
              <AlignmentLine key={index} {...line} canvasScale={editorState.viewportScale} />
            ))}

            <pre class="absolute left-0 top-0">{alignmentLineList.value}</pre>
          </div>
        </div>
      </div>
    );
  },
});

export default EditorArea;
