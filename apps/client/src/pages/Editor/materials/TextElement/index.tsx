import { defineComponent, PropType } from 'vue';
import { useSlides } from '../../models';
import TiptapEditor from '@/components/ui/Tiptap';

import { PPTTextElement } from '@/types';

const TextElement = defineComponent({
  name: 'TextElement',
  props: {
    element: Object as PropType<PPTTextElement>,
  },
  setup(props) {
    const { updateElement } = useSlides();
    // console.log(props.element);

    const onEditorChange = (html: string) => {
      if (!props.element) return;
      updateElement({
        id: props.element.id,
        props: {
          content: html,
        },
      });
    };

    return () => (
      <div
        id={props.element?.id}
        style={{
          position: 'absolute',
          width: `${props.element?.width}px`,
          height: `${props.element?.height}px`,
          left: `${props.element?.left}px`,
          top: `${props.element?.top}px`,
          transform: `rotate(${props.element?.rotate}deg)`,
          fontFamily: props.element?.defaultFontName,
          color: props.element?.defaultColor,
          backgroundColor: props.element?.fill,
          opacity: props.element?.opacity,
          wordSpacing: `${props.element?.wordSpace}px`,
          writingMode: props.element?.vertical ? 'vertical-rl' : 'horizontal-tb',
        }}
      >
        <TiptapEditor value={props.element?.content} onChange={onEditorChange} />
      </div>
    );
  },
});

export default TextElement;
