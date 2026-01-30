import { Ref } from 'vue';

export * from './element';

export function getContainer(container: string | Element | HTMLElement) {
  if (typeof container === 'string') {
    const dom = document.querySelector(container);
    if (!dom) {
      throw new Error(`container ${container} not found`);
    }
    return dom;
  }

  return container as HTMLElement;
}

export function getCanvasPosition(
  editorWrapper: Ref<HTMLElement | undefined>,
  canvas: Ref<HTMLElement | undefined>
) {
  const editorWrapperRect = editorWrapper.value?.getBoundingClientRect();
  const canvasRect = canvas.value?.getBoundingClientRect();

  if (!editorWrapperRect || !canvasRect) {
    return {
      left: 0,
      top: 0,
    };
  }

  return {
    left: (editorWrapperRect.width - canvasRect.width) / 2,
    top: (editorWrapperRect.height - canvasRect.height) / 2,
  };
}
