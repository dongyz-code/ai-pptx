import { defineComponent, PropType } from 'vue';
import { PPTElement } from '@/types';

import TextElement from '../../materials/TextElement';

const elementMap = {
  text: TextElement,
};

const EditorElement = defineComponent({
  name: 'EditorElement',
  props: {
    element: Object as PropType<PPTElement>,
  },
  setup(props) {
    // @ts-ignore
    const Component = elementMap[props.element.type];
    return () => <div class="element-wrapper">{Component && <Component element={props.element} />}</div>;
  },
});

export default EditorElement;
