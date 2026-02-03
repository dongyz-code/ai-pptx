import { defineComponent, PropType } from 'vue';

import type { GradientColor, GradientType } from '@/types/slides';

export default defineComponent({
  name: 'GradientDefs',
  props: {
    id: String,
    type: String as PropType<GradientType>,
    colors: Array as PropType<GradientColor[]>,
    rotate: Number,
  },
  setup(props) {
    return () => {
      return props.type === 'linear' ? (
        <linearGradient
          id={props.id}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform={`rotate(${props.rotate}deg)`}
        >
          {props.colors?.map((item, index) => (
            <stop key={index} offset={`${item.pos}%`} stop-color={item.color} />
          ))}
        </linearGradient>
      ) : (
        <radialGradient id={props.id}>
          {props.colors?.map((item, index) => (
            <stop key={index} offset={`${item.pos}%`} stop-color={item.color} />
          ))}
        </radialGradient>
      );
    };
  },
});
