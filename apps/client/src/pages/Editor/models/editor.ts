import { reactive } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

interface EditorState {
  /** 是否全屏 */
  isFullscreen: boolean;

  /** 当前选中的元素ID列表 */
  selectedElementIds: string[];

  /** 画布是否聚焦 */
  isCanvasFocus: boolean;

  /** 当前hover的元素ID */
  hoverElementId: string | null;

  /** 视口占编辑区域的百分比 */
  viewportPercent: number;

  /** 缩放比例 */
  viewportScale: number;

  /** 视口尺寸 */
  viewportSize: number;

  /** 视口比例 */
  viewportRatio: number;

  /** 是否正在进行缩放 */
  isScaling: boolean;
}

export const useEditor = defineStore('editor', () => {
  const editorState = reactive<EditorState>({
    isFullscreen: false,
    selectedElementIds: [],
    isCanvasFocus: false,
    hoverElementId: null,
    viewportPercent: 0.9,
    viewportScale: 1,
    viewportSize: 1000,
    viewportRatio: 16 / 9,
    isScaling: false,
  });

  const setViewportSize = (size: number) => {
    editorState.viewportSize = size;
  };

  const setViewportScale = (scale: number) => {
    editorState.viewportScale = scale;
  };

  const setSelectedElementIds = (ids: string[]) => {
    editorState.selectedElementIds = ids;
  };

  const setHoverElementId = (id: string | null) => {
    editorState.hoverElementId = id;
  };

  const setIsCanvasFocus = (focus: boolean) => {
    editorState.isCanvasFocus = focus;
  };

  const setIsScaling = (isScaling: boolean) => {
    editorState.isScaling = isScaling;
  };

  return {
    editorState,
    setViewportSize,
    setViewportScale,
    setSelectedElementIds,
    setHoverElementId,
    setIsCanvasFocus,
    setIsScaling,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditor, import.meta.hot));
}
