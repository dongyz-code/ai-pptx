import { defineComponent, PropType } from 'vue';
import type { IconName } from './primeicon';

const Icon = defineComponent({
  name: 'Icon',
  props: {
    name: String as PropType<IconName>,
  },
  setup(props) {
    return () => <i class={`pi pi-${props.name}`} />;
  },
});

export default Icon;
