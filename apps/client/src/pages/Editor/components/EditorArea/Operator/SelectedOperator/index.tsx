import { defineComponent, computed, Component, DefineComponent } from 'vue';
import { useEditor, useSlides } from '@/pages/Editor/models';
import { arrObject } from '@/utils';
import css from './index.module.scss';

import CommonOperator from './CommonOperator';

import { PPTElement } from '@/types';

const map: { [k in PPTElement['type']]?: Component } = {
  line: CommonOperator,
};

export default defineComponent({
  name: 'SelectedOperator',
  setup() {
    const { state: sliderState } = useSlides();
    const { editorState } = useEditor();
    const canOperate = computed(() => editorState.selectedElementIds.length === 1);
    const elements = computed(() => {
      const selectedIdMap = arrObject(editorState.selectedElementIds);
      return sliderState.slides[sliderState.sliderIndex].elements.filter((item) => selectedIdMap[item.id]);
    });

    return () =>
      elements.value.map((element) => {
        const _Comp = map[element.type] || CommonOperator;
        const Comp = _Comp as DefineComponent<any>;
        return (
          <Comp
            key={element.id}
            element={element}
            style={{
              width: `${element.width}px`,
              height: `${element.height || 0}px`,
              left: `${element.left}px`,
              top: `${element.top}px`,
              rotate: `${element.rotate}deg`,
            }}
            class="absolute"
          />
        );
      });
  },
});
