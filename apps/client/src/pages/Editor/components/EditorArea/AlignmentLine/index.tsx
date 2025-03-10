import { computed, defineComponent, PropType } from 'vue';
import { AlignmentLineProps } from '@/types';
import classNames from 'classnames';

const AlignmentLine = defineComponent({
  name: 'AlignmentLine',
  props: {
    type: {
      type: String as PropType<AlignmentLineProps['type']>,
      required: true,
    },
    axis: {
      type: Object as PropType<AlignmentLineProps['axis']>,
      required: true,
    },
    length: {
      type: Number as PropType<AlignmentLineProps['length']>,
      required: true,
    },
    canvasScale: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    /** 吸附线的位置 */
    const left = computed(() => props.axis.x + 'px');
    const top = computed(() => props.axis.y + 'px');

    /** 线的长度 */
    const sizeStyle = computed(() => {
      if (props.type === 'horizontal') {
        return { width: props.length + 'px' };
      } else {
        return { height: props.length + 'px' };
      }
    });

    const lineClass = computed(() => {
      return classNames('line h-0 w-0 border-dashed border-[var(--p-primary-color)]', {
        'border-l -translate-x-[0.5px]': props.type === 'vertical',
        'border-t -translate-y-[0.5px]': props.type === 'horizontal',
      });
    });

    return () => (
      <div class={'alignment-line absolute z-[100]'} style={{ left: left.value, top: top.value }}>
        <div class={lineClass.value} style={sizeStyle.value}></div>
      </div>
    );
  },
});

export default AlignmentLine;
