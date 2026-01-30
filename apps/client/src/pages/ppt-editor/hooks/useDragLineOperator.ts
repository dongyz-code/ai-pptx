import { computed, toRefs } from 'vue';
import { cloneDeep } from 'lodash-es';
import { OperateLineHandlers, PPTLineElement } from '@/types';
import { useEditor, useSlides } from '../models';

export function useDragLineOperator() {
  const editorStore = useEditor();
  const slidesStore = useSlides();
  const { viewportScale } = toRefs(editorStore.editorState);

  const elementList = computed(
    () => slidesStore.state.slides[slidesStore.state.sliderIndex]?.elements || []
  );

  const onDragLineOperator = (
    e: MouseEvent,
    element: PPTLineElement,
    command: OperateLineHandlers
  ) => {
    e.stopPropagation();

    let isMouseDown = true;

    const startPageX = e.pageX;
    const startPageY = e.pageY;

    // 克隆原始元素数据
    const originElement = cloneDeep(element);
    const originElementList = cloneDeep(elementList.value);

    // 旋转角度转弧度
    const theta = ((element.rotate || 0) * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    /**
     * 将屏幕坐标的偏移量转换为考虑旋转后的局部坐标偏移量
     */
    const transformOffset = (offsetX: number, offsetY: number) => {
      if (!element.rotate) {
        return { x: offsetX, y: offsetY };
      }
      // 应用反向旋转矩阵
      return {
        x: offsetX * cos + offsetY * sin,
        y: -offsetX * sin + offsetY * cos,
      };
    };

    /**
     * 自动计算控制点位置
     */
    const autoCalculateControlPoint = (
      start: [number, number],
      end: [number, number],
      type: 'curve' | 'broken'
    ) => {
      const midX = (start[0] + end[0]) / 2;
      const midY = (start[1] + end[1]) / 2;

      if (type === 'curve') {
        // 二次贝塞尔曲线：控制点在中点的垂直方向偏移
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offset = distance * 0.2; // 偏移量为距离的20%

        // 垂直方向的单位向量
        const perpX = -dy / distance;
        const perpY = dx / distance;

        return [midX + perpX * offset, midY + perpY * offset] as [number, number];
      } else {
        // 折线：控制点在中点
        return [midX, midY] as [number, number];
      }
    };

    /**
     * 自动计算三次贝塞尔曲线的两个控制点
     */
    const autoCalculateCubicControlPoints = (
      start: [number, number],
      end: [number, number]
    ): [[number, number], [number, number]] => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];

      // 第一个控制点在起点后1/3处
      const c1: [number, number] = [start[0] + dx / 3, start[1] + dy / 3];

      // 第二个控制点在终点前1/3处
      const c2: [number, number] = [start[0] + (dx * 2) / 3, start[1] + (dy * 2) / 3];

      return [c1, c2];
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      // 计算鼠标移动的屏幕距离（考虑缩放）
      const screenOffsetX = (e.pageX - startPageX) / viewportScale.value;
      const screenOffsetY = (e.pageY - startPageY) / viewportScale.value;

      // 转换为考虑旋转的局部坐标偏移
      const offset = transformOffset(screenOffsetX, screenOffsetY);

      // 找到当前元素在列表中的索引
      const elementIndex = originElementList.findIndex((el) => el.id === element.id);
      if (elementIndex === -1) return;

      // 克隆当前元素
      const updatedElement = cloneDeep(originElement) as PPTLineElement;

      switch (command) {
        case OperateLineHandlers.START:
          // 更新起点位置
          updatedElement.start = [
            originElement.start[0] + offset.x,
            originElement.start[1] + offset.y,
          ];

          // 如果有曲线控制点，自动重新计算
          if (updatedElement.curve) {
            updatedElement.curve = autoCalculateControlPoint(
              updatedElement.start,
              updatedElement.end,
              'curve'
            );
          } else if (updatedElement.broken) {
            updatedElement.broken = autoCalculateControlPoint(
              updatedElement.start,
              updatedElement.end,
              'broken'
            );
          } else if (updatedElement.cubic) {
            updatedElement.cubic = autoCalculateCubicControlPoints(
              updatedElement.start,
              updatedElement.end
            );
          }
          break;

        case OperateLineHandlers.END:
          // 更新终点位置
          updatedElement.end = [originElement.end[0] + offset.x, originElement.end[1] + offset.y];

          // 如果有曲线控制点，自动重新计算
          if (updatedElement.curve) {
            updatedElement.curve = autoCalculateControlPoint(
              updatedElement.start,
              updatedElement.end,
              'curve'
            );
          } else if (updatedElement.broken) {
            updatedElement.broken = autoCalculateControlPoint(
              updatedElement.start,
              updatedElement.end,
              'broken'
            );
          } else if (updatedElement.cubic) {
            updatedElement.cubic = autoCalculateCubicControlPoints(
              updatedElement.start,
              updatedElement.end
            );
          }
          break;

        case OperateLineHandlers.C:
          // 更新单个控制点（broken/broken2/curve）
          if (updatedElement.broken) {
            updatedElement.broken = [
              updatedElement.broken[0] + offset.x,
              updatedElement.broken[1] + offset.y,
            ];
          } else if (updatedElement.broken2) {
            updatedElement.broken2 = [
              updatedElement.broken2[0] + offset.x,
              updatedElement.broken2[1] + offset.y,
            ];
          } else if (updatedElement.curve) {
            updatedElement.curve = [
              updatedElement.curve[0] + offset.x,
              updatedElement.curve[1] + offset.y,
            ];
          }
          break;

        case OperateLineHandlers.C1:
          // 更新三次贝塞尔曲线的第一个控制点
          if (updatedElement.cubic) {
            const [c1, c2] = updatedElement.cubic;
            updatedElement.cubic = [[c1[0] + offset.x, c1[1] + offset.y], c2];
          }
          break;

        case OperateLineHandlers.C2:
          // 更新三次贝塞尔曲线的第二个控制点
          if (updatedElement.cubic) {
            const [c1, c2] = updatedElement.cubic;
            updatedElement.cubic = [c1, [c2[0] + offset.x, c2[1] + offset.y]];
          }
          break;

        default:
          break;
      }

      // 更新元素列表
      const newElementList = [...originElementList];
      newElementList[elementIndex] = updatedElement;

      // 应用更新
      slidesStore.setElements(newElementList);
    };

    const onMouseUp = () => {
      isMouseDown = false;
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
    };

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
  };

  return {
    onDragLineOperator,
  };
}
