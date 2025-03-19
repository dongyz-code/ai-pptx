import { defineComponent, computed, PropType } from 'vue';
import classNames from 'classnames';
import css from './index.module.scss';
import type { OPERATE_LINE } from '@/constants';

const BorderLine = defineComponent({
  name: 'BorderLine',
  props: {
    type: {
      type: String as PropType<OPERATE_LINE>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div
        class={classNames('border-primary absolute left-0 top-0 h-0 w-0 border-0', css['border-line'], css[props.type])}
      ></div>
    );
  },
});

export default BorderLine;
