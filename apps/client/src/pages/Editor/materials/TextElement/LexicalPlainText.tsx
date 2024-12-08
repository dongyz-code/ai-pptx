import { defineComponent, onMounted, PropType, ref } from 'vue';
import { $insertNodes, createEditor } from 'lexical';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';

const LexicalPlainTextElement = defineComponent({
  name: 'LexicalPlainTextElementTextElement',
  props: {
    modelValue: String as PropType<string>,
  },
  emits: ['update:modelValue'],
  setup(props) {
    const editorRef = ref<HTMLDivElement>();
    const editor = createEditor();

    onMounted(() => {
      const html = props.modelValue;
      if (html) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);

        editor.update(() => {
          $insertNodes(nodes);
        });
      }
      editor.setRootElement(editorRef.value!);
    });

    return () => <div ref={editorRef}></div>;
  },
});

export default LexicalPlainTextElement;
