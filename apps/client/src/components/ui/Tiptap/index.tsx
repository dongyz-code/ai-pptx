import { defineComponent, SetupContext, toRef, watch } from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { Color } from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import { FontSize } from './extensions';

import './tiptap-pre.css';

const TiptapEditor = defineComponent({
  name: 'Tiptap',

  props: {
    value: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  emits: {
    change: (value: string) => true,
    blur: () => true,
  },

  setup(props, { emit }) {
    const editor = useEditor({
      content: props.value,
      extensions: [
        TextStyle,
        FontSize,
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        StarterKit,
      ],
      editable: props.editable,
      autofocus: 'all',
      onUpdate: ({ editor }) => emit('change', editor.getHTML()),
      onBlur: () => emit('blur'),
    });

    watch(toRef(props, 'value'), (val) => {
      const isSame = editor.value?.getHTML() === val;
      if (!isSame) {
        editor.value?.commands.setContent(val || '', false);
      }
    });

    watch(toRef(props, 'editable'), (val) => {
      editor.value?.setOptions({ editable: val });
      editor.value?.commands.focus();
    });

    return () => <EditorContent class="select-none" editor={editor.value} />;
  },
});

export default TiptapEditor;
