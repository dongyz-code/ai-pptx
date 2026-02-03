import { toRefs } from 'vue';
import { useEditor, useKeyboard, useSlides } from '@/pages/ppt-editor/models';
import type { PPTElement, PPTLineElement } from '@/types';

export function useRotateElement() {
  const editorStore = useEditor();
  const slidesStore = useSlides();
  const keyboardStore = useKeyboard();
  const { viewportScale } = toRefs(editorStore.editorState);

  const rotateElement = (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!editorStore.editorState.selectedElementIds.includes(element.id)) return;

    const canvas = document.getElementById('editor-canvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.scrollX;
    const canvasTop = canvasRect.top + window.scrollY;

    const centerX = canvasLeft + (element.left + element.width / 2) * viewportScale.value;
    const centerY = canvasTop + (element.top + element.height / 2) * viewportScale.value;

    let isMouseDown = true;
    const originRotate = element.rotate || 0;
    const startAngle = Math.atan2(e.pageY - centerY, e.pageX - centerX);
    let rafId: number | null = null;
    let latestPageX = e.pageX;
    let latestPageY = e.pageY;

    const applyRotate = (pageX: number, pageY: number) => {
      if (!isMouseDown) return;
      const currentAngle = Math.atan2(pageY - centerY, pageX - centerX);
      let nextRotate = originRotate + ((currentAngle - startAngle) * 180) / Math.PI;

      if (keyboardStore.keyboardState.isShiftKey) {
        nextRotate = Math.round(nextRotate / 15) * 15;
      }

      slidesStore.updateElement({
        id: element.id,
        props: {
          rotate: nextRotate,
        },
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      latestPageX = event.pageX;
      latestPageY = event.pageY;

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyRotate(latestPageX, latestPageY);
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
    rotateElement,
  };
}
