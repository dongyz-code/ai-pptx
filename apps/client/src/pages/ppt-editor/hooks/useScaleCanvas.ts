import { throttle } from 'lodash-es';
import { useEditor } from '../models';

export const useScaleCanvas = () => {
  const { editorState, setViewportScale } = useEditor();

  /**
   * 缩放
   */
  const scaleCanvas = (command: 'zoomIn' | 'zoomOut') => {
    let percentage = editorState.viewportScale * 100;

    const step = 5;
    const max = 500;
    const min = 10;

    if (command === 'zoomIn') {
      percentage += step;
      if (percentage > max) {
        percentage = max;
      }
    } else {
      percentage -= step;
      if (percentage < min) {
        percentage = min;
      }
    }

    setViewportScale(percentage / 100);
  };

  return {
    scaleCanvas: throttle(scaleCanvas, 100),
  };
};
