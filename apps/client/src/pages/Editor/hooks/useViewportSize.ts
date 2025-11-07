import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useEditor } from '../models';

/**
 * 计算画布的尺寸
 * @param wrapperRef 画布的容器
 * @returns 画布的尺寸
 */
export function useViewportSize(wrapperRef: Ref<HTMLDivElement | undefined>) {
  const { editorState, setViewportScale } = useEditor();
  const canvasLeft = ref(0);
  const canvasTop = ref(0);

  const updateViewportSize = () => {
    const dom = wrapperRef.value;
    if (!dom) return;

    const { width, height } = dom.getBoundingClientRect();
    if (width / height > editorState.viewportRatio) {
      const viewportHeight = height * editorState.viewportPercent;
      const viewportWidth = viewportHeight * editorState.viewportRatio;
      const scale = viewportWidth / editorState.viewportSize;
      canvasLeft.value = (width - viewportWidth) / 2;
      canvasTop.value = (height - viewportHeight) / 2;
      setViewportScale(scale);
    } else {
      const viewportWidth = width * editorState.viewportPercent;
      const viewportHeight = viewportWidth / editorState.viewportRatio;
      const scale = viewportWidth / editorState.viewportSize;
      canvasLeft.value = (width - viewportWidth) / 2;
      canvasTop.value = (height - viewportHeight) / 2;
      setViewportScale(scale);
    }
  };

  const updateCanvasPosition = () => {
    const dom = wrapperRef.value;
    if (!dom) return;

    const { width, height } = dom.getBoundingClientRect();
    const viewportHeight = height * editorState.viewportPercent;
    const viewportWidth = viewportHeight * editorState.viewportRatio;
    canvasLeft.value = (width - viewportWidth) / 2;
    canvasTop.value = (height - viewportHeight) / 2;
  };

  watch(() => editorState.viewportScale, updateCanvasPosition);
  watch(() => editorState.viewportSize, updateViewportSize);
  watch(() => editorState.viewportRatio, updateViewportSize);

  const observer = new ResizeObserver(updateViewportSize);

  onMounted(() => {
    if (wrapperRef.value) {
      observer.observe(wrapperRef.value);
    }
  });

  onUnmounted(() => {
    if (wrapperRef.value) {
      observer.unobserve(wrapperRef.value);
    }
  });

  const positionStyle = computed(() => {
    const width = editorState.viewportSize * editorState.viewportScale;
    const height = width / editorState.viewportRatio;
    return {
      left: `${canvasLeft.value}px`,
      top: `${canvasTop.value}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  });

  return {
    canvasLeft,
    canvasTop,
    positionStyle,
  };
}
