import { onMounted, onUnmounted } from 'vue';
import { useKeyboard } from '../models';
import { HOTKEY } from '../static/constant';

export function useGlobalHotkey() {
  const { setActiveKey, keyboardState } = useKeyboard();

  /**
   * 全局按键监听
   */
  const keyboardListener = (isDown: boolean) => {
    return (e: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, altKey } = e;
      const key = e.key.toUpperCase();

      const isCtrlOrMetaKey = ctrlKey || metaKey || key === HOTKEY.CONTROL;
      if (isCtrlOrMetaKey && keyboardState.isCtrlKey !== isDown) {
        setActiveKey('isCtrlKey', isDown);
      }

      const isShiftKey = shiftKey || key === HOTKEY.SHIFT;
      if (isShiftKey && keyboardState.isShiftKey !== isDown) {
        setActiveKey('isShiftKey', isDown);
      }

      const isAltKey = altKey || key === HOTKEY.ALT;
      if (isAltKey && keyboardState.isAltKey !== isDown) {
        setActiveKey('isAltKey', isDown);
      }

      if (key === HOTKEY.SPACE && keyboardState.isSpaceKey !== isDown) {
        setActiveKey('isSpaceKey', isDown);
      }
    };
  };

  const onKeyDown = keyboardListener(true);
  const onKeyUp = keyboardListener(false);

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  });
}
