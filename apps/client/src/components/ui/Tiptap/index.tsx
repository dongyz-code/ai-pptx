import { defineComponent, SetupContext, toRef, watch } from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { Color } from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import { FontSize } from './extensions';

import './tiptap-pre.css';

import type { TiptapProps, TiptapEmits } from './props';

const TiptapEditor = defineComponent({
  name: 'Tiptap',

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  emits: {
    change: (value: string) => value,
  },

  setup(props: TiptapProps, { emit }: SetupContext<TiptapEmits>) {
    const editor = useEditor({
      content: props.value,
      extensions: [TextStyle, FontSize, Color.configure({ types: [TextStyle.name, ListItem.name] }), StarterKit],
      editable: true,
      onUpdate: ({ editor }) => {
        emit('change', editor.getHTML());
      },
    });

    watch(toRef(props, 'value'), (val) => {
      const isSame = editor.value?.getHTML() === val;
      if (!isSame) {
        editor.value?.commands.setContent(val || '', false);
      }
    });

    return () => <EditorContent editor={editor.value} />;
  },
});

export default TiptapEditor;
