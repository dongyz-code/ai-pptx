import { defineComponent, onMounted, PropType, ref } from 'vue';
import { useSlides } from '../../models';
import TiptapEditor from '@/components/ui/Tiptap';

import { PPTTextElement } from '@/types';

const TextElement = defineComponent({
  name: 'TextElement',
  props: {
    element: Object as PropType<PPTTextElement>,
    selectElement: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props) {
    const { updateElement } = useSlides();
    const editable = ref(false);
    const editorRef = ref<InstanceType<typeof TiptapEditor>>();

    const onEditorChange = (html: string) => {
      if (!props.element) return;

      const height = editorRef.value?.$el?.clientHeight;

      updateElement({
        id: props.element.id,
        props: {
          content: html,
          height: height || undefined,
        },
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      if (editable.value) return;
      props.selectElement?.(e);
    };

    const onActive = () => {
      editable.value = true;
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
        onMousedown={onMouseDown}
        onDblclick={onActive}
      >
        <TiptapEditor
          ref={editorRef}
          value={props.element?.content}
          editable={editable.value}
          onChange={onEditorChange}
          onBlur={() => {
            editable.value = false;
          }}
        />

        {!editable.value && <div class="absolute left-0 top-0 h-full w-full cursor-move"></div>}
      </div>
    );
  },
});

export default TextElement;
