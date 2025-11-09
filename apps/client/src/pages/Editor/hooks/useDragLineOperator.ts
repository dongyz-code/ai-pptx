import { OperateLineHandlers, PPTLineElement } from '@/types';
import { useEditor } from '../models';

export function useDragLineOperator() {
  const { editorState, selectedIdMap } = useEditor();

  const onDragLineOperator = (e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => {
    let isMouseDown = true;

    const startPageX = e.pageX;
    const startPageY = e.pageY;

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const offsetX = e.pageX - startPageX;
      const offsetY = e.pageY - startPageY;

      switch (command) {
        case OperateLineHandlers.START:
          element.start[0] += offsetX;
          element.start[1] += offsetY;
          break;
        case OperateLineHandlers.END:
          element.end[0] += offsetX;
          element.end[1] += offsetY;
          break;
        case OperateLineHandlers.C1:

        case OperateLineHandlers.C2:


        default:
          break;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    onDragLineOperator,
  };
}
