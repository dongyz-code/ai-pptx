import { onMounted, onUnmounted } from 'vue';
import { useKeyboard } from '../models';
import { HOTKEY } from '../static/constant';

export function useGlobalHotkey() {
  const keyboardStore = useKeyboard();

  /**
   * 全局按键监听
   */
  const keyboardListener = (e: KeyboardEvent) => {
    const { ctrlKey, metaKey, shiftKey, altKey } = e;
    const key = e.key.toLowerCase();

    const isCtrlOrMetaKey = ctrlKey || metaKey;
    if (isCtrlOrMetaKey && !keyboardStore.keyboardState.isCtrlKey) {
      keyboardStore.setActiveKey('isCtrlKey', true);
    }

    if (shiftKey && !keyboardStore.keyboardState.isShiftKey) {
      keyboardStore.setActiveKey('isShiftKey', true);
    }

    if (altKey && !keyboardStore.keyboardState.isAltKey) {
      keyboardStore.setActiveKey('isAltKey', true);
    }

    if (key === HOTKEY.SPACE && !keyboardStore.keyboardState.isSpaceKey) {
      keyboardStore.setActiveKey('isSpaceKey', true);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', keyboardListener);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', keyboardListener);
  });
}
