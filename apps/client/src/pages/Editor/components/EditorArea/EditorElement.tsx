import { defineComponent, ref, watch, PropType } from 'vue';
import { useElementHover } from '@vueuse/core';
import { useEditor } from '../../models';
import { usePrimeVue } from 'primevue/config';

import TextElement from '../../materials/TextElement';
import ShapeElement from '../../materials/ShapeElement';

import type { PPTElement } from '@/types';

const elementMap = {
  text: TextElement,
  shape: ShapeElement,
};

const EditorElement = defineComponent({
  name: 'EditorElement',
  props: {
    element: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
  },
  setup(props) {
    const editor = useEditor();

    const wrapperRef = ref<HTMLDivElement>();
    const isHovering = useElementHover(wrapperRef);

    watch(isHovering, (value) => {
      // editor.setHoverElementId(value ? props.element.id : null);
      editor.setHoverElementId(props.element.id);
    });

    // @ts-expect-error element type is dynamically mapped to component
    const Component = elementMap[props.element.type];

    return () => (
      <div ref={wrapperRef} class="element-wrapper" onClick={() => editor.setSelectedElementIds([props.element.id])}>
        {Component && <Component element={props.element} />}
      </div>
    );
  },
});

export default EditorElement;
