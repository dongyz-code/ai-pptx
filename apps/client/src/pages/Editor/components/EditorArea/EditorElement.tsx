import { defineComponent, PropType } from 'vue';
import { PPTElement } from '@/types';

import TextElement from '../../materials/TextElement';
import ShapeElement from '../../materials/ShapeElement';

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
    // @ts-expect-error element type is dynamically mapped to component
    const Component = elementMap[props.element.type];
    // console.log(Component);
    return () => <div class="element-wrapper">{Component && <Component element={props.element} />}</div>;
  },
});

export default EditorElement;
