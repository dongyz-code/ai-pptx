import { defineComponent, computed, PropType } from 'vue';
import GradientDefs from './GradientDefs';
import type { PPTShapeElement } from '@/types';
import { useElementFlip } from '../../hooks';

const ShapeElement = defineComponent({
  name: 'ShapeElement',
  props: {
    element: {
      type: Object as PropType<PPTShapeElement>,
      required: true,
    },
    selectElement: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props) {
    const flipH = computed(() => props.element.flipH);
    const flipV = computed(() => props.element.flipV);
    const { flipStyle } = useElementFlip(flipH, flipV);

    return () => (
      <div
        id={props.element?.id}
        style={{
          position: 'absolute',
          width: `${props.element.width}px`,
          height: `${props.element.height}px`,
          left: `${props.element.left}px`,
          top: `${props.element.top}px`,
          transform: `rotate(${props.element.rotate}deg)`,
        }}
        onMousedown={props.selectElement}
      >
        <div class="shape-element" style={{ opacity: props.element.opacity, filter: '', transform: flipStyle.value }}>
          <svg overflow="visible" width={props.element.width} height={props.element.height}>
            {props.element?.gradient && (
              <defs>
                <GradientDefs
                  id={`editabel-gradient-${props.element?.id}`}
                  type={props.element?.gradient.type}
                  colors={props.element?.gradient.colors}
                  rotate={props.element?.gradient.rotate}
                />
              </defs>
            )}

            <g
              transform={`scale(${props.element.width / props.element.viewBox[0]}, ${props.element?.height / props.element.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
            >
              <path
                class="shape-element-path"
                vector-effect="non-scaling-stroke"
                stroke-linecap="butt"
                stroke-miterlimit={8}
                d={props.element?.path}
                fill={props.element.gradient ? `url(#editabel-gradient-${props.element?.id})` : props.element?.fill}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  },
});

export default ShapeElement;
