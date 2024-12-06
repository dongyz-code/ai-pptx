import { reactive } from 'vue';
import { defineStore } from 'pinia';

interface MainState {
  /** 是否全屏 */
  isFullscreen: boolean;

  /** 当前选中的元素ID列表 */
  selectedElementIds: string[];
}

export const useMain = defineStore('main', () => {
  const state = reactive<MainState>({
    isFullscreen: false,
    selectedElementIds: [],
  });

  return { state };
});

export default useMain;
