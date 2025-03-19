import { defineComponent, computed, PropType, toRefs } from 'vue';
import classNames from 'classnames';
import { useEditor } from '@/pages/Editor/models';
import { getCommonOperate } from '@/pages/Editor/utils';
import css from './index.module.scss';

import BorderLine from './BorderLine';

import type { PPTVideoElement, PPTLatexElement, PPTAudioElement, PPTChartElement } from '@/types';

type PPTElementCommon = PPTVideoElement | PPTLatexElement | PPTAudioElement | PPTChartElement;

const CommonOperator = defineComponent({
  name: 'CommonOperator',
  props: {
    element: {
      type: Object as PropType<PPTElementCommon>,
      required: true,
    },
  },
  setup(props) {
    const { editorState } = useEditor();
    const { viewportScale } = toRefs(editorState);

    const width = computed(() => props.element.width * viewportScale.value);
    const height = computed(() => props.element.height * viewportScale.value);
    const operate = computed(() => getCommonOperate(width.value, height.value));

    return () => (
      <div class={css['common-operator']}>
        {operate.value.borderLines.map((item) => (
          <BorderLine key={item.type} type={item.type} style={item.style}></BorderLine>
        ))}
      </div>
    );
  },
});

export default CommonOperator;
