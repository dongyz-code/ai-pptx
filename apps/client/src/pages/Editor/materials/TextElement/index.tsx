import { defineComponent, PropType } from 'vue';
import LexicalPlainTextElement from './LexicalPlainText';

import { PPTTextElement } from '@/types';

const TextElement = defineComponent({
  name: 'TextElement',
  props: {
    element: Object as PropType<PPTTextElement>,
  },
  setup(props) {
    return () => <LexicalPlainTextElement modelValue={props.element?.content} />;
  },
});

export default TextElement;
