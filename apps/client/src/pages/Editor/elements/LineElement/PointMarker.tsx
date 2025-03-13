import { computed, defineComponent, PropType } from 'vue';
import type { LinePoint } from '@/types';

type NonEmptyLinePoint = Exclude<LinePoint, ''>;

const PointMarker = defineComponent({
  name: 'PointMarker',
  props: {
    id: {
      type: String,
      required: true,
    },
    position: {
      type: String as PropType<'start' | 'end'>,
      required: true,
    },
    type: {
      type: String as PropType<NonEmptyLinePoint>,
      required: true,
    },
    baseSize: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
  },
  setup(props) {
    const size = computed(() => Math.max(props.baseSize, 2));

    const pathMap = {
      dot: 'm0 5a5 5 0 1 0 10 0a5 5 0 1 0 -10 0z',
      arrow: 'M0,0 L10,5 0,10 Z',
    };

    const rotateMap: { [key: string]: number } = {
      'arrow-start': 180,
      'arrow-end': 0,
    };

    const rotate = computed(() => rotateMap[`${props.type}-${props.position}`] || 0);

    return () => (
      <marker
        id={`${props.id}-${props.type}-${props.position}`}
        markerUnits="userSpaceOnUse"
        orient="auto"
        markerWidth={size.value * 3}
        markerHeight={size.value * 3}
        refX={size.value * 1.5}
        refY={size.value * 1.5}
      >
        <path
          d={pathMap[props.type]}
          fill={props.color}
          transform={`scale(${size.value * 0.3}, ${size.value * 0.3}) rotate(${rotate.value}, 5, 5)`}
        ></path>
      </marker>
    );
  },
});

export default PointMarker;
