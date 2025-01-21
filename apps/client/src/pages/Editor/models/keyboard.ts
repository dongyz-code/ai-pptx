import { reactive } from 'vue';
import { defineStore } from 'pinia';

interface KeyboardState {
  /** 是否按下 shift 键 */
  isShiftKey: boolean;
  /** 是否按下 ctrl 键 */
  isCtrlKey: boolean;
  /** 是否按下 alt 键 */
  isAltKey: boolean;
  /** 是否按下 space 键 */
  isSpaceKey: boolean;
}

export const useKeyboard = defineStore('keyboard', () => {
  const keyboardState = reactive<KeyboardState>({
    isShiftKey: false,
    isCtrlKey: false,
    isAltKey: false,
    isSpaceKey: false,
  });

  const setActiveKey = (key: keyof KeyboardState, isShiftKey: boolean) => {
    keyboardState[key] = isShiftKey;
  };

  return {
    keyboardState,
    setActiveKey,
  };
});
