import { computed, reactive } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';

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

  const ctrlOrShiftKeyActive = computed(() => {
    return keyboardState.isShiftKey || keyboardState.isCtrlKey;
  });

  const setActiveKey = (key: keyof KeyboardState, isActive: boolean) => {
    keyboardState[key] = isActive;
  };

  return {
    keyboardState,
    setActiveKey,
    ctrlOrShiftKeyActive,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKeyboard, import.meta.hot));
}
