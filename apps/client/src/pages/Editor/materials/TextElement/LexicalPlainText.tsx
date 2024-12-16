import { defineComponent, onMounted, PropType, ref } from 'vue';
import { $getRoot, $insertNodes, createEditor } from 'lexical';
import { registerRichText } from '@lexical/rich-text';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';

const LexicalPlainTextElement = defineComponent({
  name: 'LexicalPlainTextElementTextElement',
  props: {
    modelValue: String as PropType<string>,
  },
  emits: ['update:modelValue'],
  setup(props) {
    const editorRef = ref<HTMLDivElement>();
    const editor = createEditor({
      namespace: 'RichTextEditor',
    });

    onMounted(() => {
      const html = props.modelValue;

      console.log(editorRef.value);
      editor.setRootElement(editorRef.value!);
      registerRichText(editor);

      if (html) {
        editorRef.value!.innerHTML = html;
        const document = new DOMParser().parseFromString(html, 'text/html');

        editor.update(() => {
          const nodes = $generateNodesFromDOM(editor, document);
          const root = $getRoot();
          root.append(...nodes);
        });
      }
    });

    return () => <div id="editor" ref={editorRef} contenteditable></div>;
  },
});

export default LexicalPlainTextElement;
