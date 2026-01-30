import { computed, defineComponent, PropType, toRefs } from 'vue';
import classNames from 'classnames';
import { getLineElementPath } from '../../utils';
import PointMarker from './PointMarker';
import { PPTLineElement } from '@/types';

/**
 *
 */
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
    /** 计算svg的宽高 */
    const svgSize = computed(() => {
      const width = Math.abs(props.element.start[0] - props.element.end[0]);
      const height = Math.abs(props.element.start[1] - props.element.end[1]);
      return {
        width: Math.max(width, 24),
        height: Math.max(height, 24),
      };
    });

    /** 线条路径 */
    const path = computed(() => getLineElementPath(props.element));

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
        <svg overflow="visible" width={svgSize.value.width} height={svgSize.value.height}>
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
            d={path.value}
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
            fill="null"
          ></path>
          <path
            class={classNames('pointer-events-auto, cursor-move')}
            d={path.value}
            stroke="transparent"
            stroke-width="20"
            fill="null"
            onMousedown={props.selectElement}
          ></path>
        </svg>
      </div>
    );
  },
});

export default LineElement;
