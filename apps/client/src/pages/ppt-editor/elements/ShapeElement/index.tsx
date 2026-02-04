import { defineComponent, computed, PropType } from 'vue';
import GradientDefs from './GradientDefs';
import { useElementFlip } from '../../hooks';
import type { PPTShapeElement } from '@/types';

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
    const outline = computed(() => props.element.outline);
    const outlineWidth = computed(() => outline.value?.width ?? 0);
    const outlineColor = computed(() => outline.value?.color ?? '#000');
    const outlineDasharray = computed(() => {
      if (!outlineWidth.value) return undefined;
      switch (outline.value?.style) {
        case 'dashed':
          return `${outlineWidth.value * 4} ${outlineWidth.value * 2}`;
        case 'dotted':
          return `${outlineWidth.value} ${outlineWidth.value * 2}`;
        default:
          return undefined;
      }
    });

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
        <div
          class="shape-element"
          style={{ opacity: props.element.opacity, filter: '', transform: flipStyle.value }}
        >
          <svg overflow="visible" width={props.element.width} height={props.element.height}>
            {props.element?.gradient && (
              <defs>
                <GradientDefs
                  id={`editable-gradient-${props.element?.id}`}
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
                stroke={outlineWidth.value ? outlineColor.value : 'none'}
                stroke-width={outlineWidth.value || undefined}
                stroke-dasharray={outlineDasharray.value}
                d={props.element?.path}
                fill={
                  props.element.gradient
                    ? `url(#editable-gradient-${props.element?.id})`
                    : props.element?.fill
                }
              />
            </g>
          </svg>
        </div>
      </div>
    );
  },
});

export default ShapeElement;
