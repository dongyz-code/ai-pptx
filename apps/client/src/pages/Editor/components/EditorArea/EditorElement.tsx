import { defineComponent, ref, watch, PropType, computed } from 'vue';
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
    zIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const editor = useEditor();

    const wrapperRef = ref<HTMLDivElement>();
    const isHovering = useElementHover(wrapperRef);

    watch(isHovering, (value) => {
      editor.setHoverElementId(value ? props.element.id : null);
    });

    // @ts-expect-error element type is dynamically mapped to component
    const Component = elementMap[props.element.type];

    const componentProps = computed(() => {
      return {};
    });

    return () => (
      <div
        ref={wrapperRef}
        data-id={props.element.id}
        class="element-wrapper"
        onClick={() => editor.setSelectedElementIds([props.element.id])}
        style={{ zIndex: props.zIndex }}
      >
        {Component && <Component element={props.element} {...componentProps.value} />}
      </div>
    );
  },
});

export default EditorElement;
