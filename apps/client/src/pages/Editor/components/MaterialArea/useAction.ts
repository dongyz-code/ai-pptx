import { uuid } from '@/utils';
import { useSlides, useEditor } from '../../models';

export const useAction = () => {
  const { addElement } = useSlides();
  const { editorState } = useEditor();

  const onAddText = () => {
    const { viewportSize } = editorState;

    const width = 200;
    const height = 30;
    const left = viewportSize / 2 - width / 2;
    const top = viewportSize / 2 - height / 2;

    addElement({
      id: uuid(),
      type: 'text',
      top: top,
      left: left,
      width: width,
      height: height,
      content: '你的段落文字',
      rotate: 0,
      defaultFontName: 'Microsoft Yahei',
      defaultColor: '#333',
    });
  };

  return {
    onAddText,
  };
};
