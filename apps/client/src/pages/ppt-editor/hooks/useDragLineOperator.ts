import { toRefs } from 'vue';
import { OperateLineHandlers, PPTLineElement } from '@/types';
import { useEditor, useSlides } from '../models';

const movePoint = (point: [number, number], offsetX: number, offsetY: number): [number, number] => [
  point[0] + offsetX,
  point[1] + offsetY,
];

const cloneLineElement = (element: PPTLineElement): PPTLineElement => ({
  ...element,
  start: [...element.start] as [number, number],
  end: [...element.end] as [number, number],
  broken: element.broken ? ([...element.broken] as [number, number]) : undefined,
  broken2: element.broken2 ? ([...element.broken2] as [number, number]) : undefined,
  curve: element.curve ? ([...element.curve] as [number, number]) : undefined,
  cubic: element.cubic
    ? [[...element.cubic[0]] as [number, number], [...element.cubic[1]] as [number, number]]
    : undefined,
});

const isBroken2Horizontal = (element: PPTLineElement) =>
  Math.abs(element.end[0] - element.start[0]) >= Math.abs(element.end[1] - element.start[1]);

const updateLineByCommand = (
  originElement: PPTLineElement,
  command: OperateLineHandlers,
  offsetX: number,
  offsetY: number
) => {
  const updatedElement = cloneLineElement(originElement);

  switch (command) {
    case OperateLineHandlers.START:
      updatedElement.start = movePoint(originElement.start, offsetX, offsetY);
      break;

    case OperateLineHandlers.END:
      updatedElement.end = movePoint(originElement.end, offsetX, offsetY);
      break;

    case OperateLineHandlers.C:
      if (originElement.broken) {
        updatedElement.broken = movePoint(originElement.broken, offsetX, offsetY);
      } else if (originElement.broken2) {
        const isHorizontal = isBroken2Horizontal(originElement);
        updatedElement.broken2 = [
          originElement.broken2[0] + (isHorizontal ? offsetX : 0),
          originElement.broken2[1] + (isHorizontal ? 0 : offsetY),
        ];
      } else if (originElement.curve) {
        updatedElement.curve = movePoint(originElement.curve, offsetX, offsetY);
      }
      break;

    case OperateLineHandlers.C1:
      if (originElement.cubic) {
        updatedElement.cubic = [
          movePoint(originElement.cubic[0], offsetX, offsetY),
          [...originElement.cubic[1]] as [number, number],
        ];
      }
      break;

    case OperateLineHandlers.C2:
      if (originElement.cubic) {
        updatedElement.cubic = [
          [...originElement.cubic[0]] as [number, number],
          movePoint(originElement.cubic[1], offsetX, offsetY),
        ];
      }
      break;

    default:
      break;
  }

  return updatedElement;
};

/**
 * 线条元素 关键点控制
 */
export function useDragLineOperator() {
  const editorStore = useEditor();
  const slidesStore = useSlides();
  const { viewportScale } = toRefs(editorStore.editorState);

  const onDragLineOperator = (
    e: MouseEvent,
    element: PPTLineElement,
    command: OperateLineHandlers
  ) => {
    e.stopPropagation();

    let isMouseDown = true;

    const startPageX = e.pageX;
    const startPageY = e.pageY;
    let rafId: number | null = null;
    let latestPageX = startPageX;
    let latestPageY = startPageY;

    const originElement = cloneLineElement(element);

    const applyMove = (pageX: number, pageY: number) => {
      if (!isMouseDown) return;

      const offsetX = (pageX - startPageX) / viewportScale.value;
      const offsetY = (pageY - startPageY) / viewportScale.value;
      const updatedElement = updateLineByCommand(originElement, command, offsetX, offsetY);

      slidesStore.updateElement({
        id: element.id,
        props: {
          start: updatedElement.start,
          end: updatedElement.end,
          broken: updatedElement.broken,
          broken2: updatedElement.broken2,
          curve: updatedElement.curve,
          cubic: updatedElement.cubic,
        },
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      latestPageX = e.pageX;
      latestPageY = e.pageY;

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyMove(latestPageX, latestPageY);
      });
    };

    const onMouseUp = () => {
      isMouseDown = false;
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    onDragLineOperator,
  };
}
