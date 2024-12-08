import { defineComponent, PropType } from 'vue';
import { PPTElement } from '@/types';

import TextElement from '../../materials/TextElement';

const elementMap = {
  text: TextElement,
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
    // @ts-expect-error element type is dynamically mapped to component
    const Component = elementMap[props.element.type];
    return () => <div class="element-wrapper">{Component && <Component element={props.element} />}</div>;
  },
});

export default EditorElement;
