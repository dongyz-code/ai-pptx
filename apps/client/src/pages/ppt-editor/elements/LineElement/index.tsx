import { computed, defineComponent, PropType } from 'vue';
import classNames from 'classnames';
import { getLineElementPath } from '../../utils';
import PointMarker from './PointMarker';
import { PPTLineElement } from '@/types';

const toLocalPoint = (
  point: [number, number],
  minX: number,
  minY: number,
  padding: number
): [number, number] => [point[0] - minX + padding, point[1] - minY + padding];

const LineElement = defineComponent({
  name: 'LineElement',
  props: {
    element: {
      type: Object as PropType<PPTLineElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent) => void>,
      required: true,
    },
  },
  setup(props) {
    const geometry = computed(() => {
      const el = props.element;
      const allPoints: [number, number][] = [el.start, el.end];

      if (el.broken) allPoints.push(el.broken);
      if (el.broken2) allPoints.push(el.broken2);
      if (el.curve) allPoints.push(el.curve);
      if (el.cubic) allPoints.push(...el.cubic);

      const xs = allPoints.map((p) => p[0]);
      const ys = allPoints.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const padding = Math.max(12, el.width * 5);

      const localElement: PPTLineElement = {
        ...el,
        start: toLocalPoint(el.start, minX, minY, padding),
        end: toLocalPoint(el.end, minX, minY, padding),
        broken: el.broken ? toLocalPoint(el.broken, minX, minY, padding) : undefined,
        broken2: el.broken2 ? toLocalPoint(el.broken2, minX, minY, padding) : undefined,
        curve: el.curve ? toLocalPoint(el.curve, minX, minY, padding) : undefined,
        cubic: el.cubic
          ? [
              toLocalPoint(el.cubic[0], minX, minY, padding),
              toLocalPoint(el.cubic[1], minX, minY, padding),
            ]
          : undefined,
      };

      const width = Math.max(maxX - minX + padding * 2, 24);
      const height = Math.max(maxY - minY + padding * 2, 24);

      return {
        width,
        height,
        left: minX - padding,
        top: minY - padding,
        path: getLineElementPath(localElement),
        hitStrokeWidth: Math.max(20, el.width * 8),
      };
    });

    /** 线条样式 */
    const strokeDasharray = computed(() => {
      const { width } = props.element;
      if (props.element.style === 'dashed') {
        return width <= 8 ? `${width * 5} ${width * 2.5}` : `${width * 5} ${width * 1.5}`;
      }

      if (props.element.style === 'dotted') {
        return width <= 8 ? `${width * 1.8} ${width * 1.6}` : `${width * 1.5} ${width * 1.2}`;
      }

      return '0 0';
    });

    return () => (
      <div
        id={props.element?.id}
        class="line-element absolute"
        style={{ top: props.element?.top + 'px', left: props.element?.left + 'px' }}
      >
        <svg
          overflow="visible"
          width={geometry.value.width}
          height={geometry.value.height}
          style={{
            position: 'absolute',
            left: `${geometry.value.left}px`,
            top: `${geometry.value.top}px`,
          }}
        >
          <defs>
            {props.element.points[0] && (
              <PointMarker
                id={props.element.id}
                position="start"
                type={props.element.points[0]}
                baseSize={props.element.width}
                color={props.element.color}
              />
            )}

            {props.element.points[1] && (
              <PointMarker
                id={props.element.id}
                position="end"
                type={props.element.points[1]}
                baseSize={props.element.width}
                color={props.element.color}
              />
            )}
          </defs>

          <path
            class="line-point"
            d={geometry.value.path}
            stroke={props.element.color}
            stroke-width={props.element.width}
            stroke-dasharray={strokeDasharray.value}
            marker-start={
              props.element.points[0] &&
              `url(#${props.element.id}-${props.element.points[0]}-start)`
            }
            marker-end={
              props.element.points[1] && `url(#${props.element.id}-${props.element.points[1]}-end)`
            }
            fill="none"
          ></path>
          <path
            class={classNames('pointer-events-auto', 'cursor-move')}
            d={geometry.value.path}
            stroke="transparent"
            stroke-width={geometry.value.hitStrokeWidth}
            fill="none"
            onMousedown={props.selectElement}
          ></path>
        </svg>
      </div>
    );
  },
});

export default LineElement;
