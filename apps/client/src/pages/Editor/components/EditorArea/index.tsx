import { defineComponent } from 'vue';
import { useSlides } from '../../models/slider';

import type { Slide } from '@/types';

const EditorArea = defineComponent({
  name: 'EditorArea',
  setup() {
    const { state } = useSlides();

    const formatJson = (slides: Slide[]) => {
      const data = slides.map((slide) => ({
        id: slide.id,
      }));

      return JSON.stringify(data, null, 2);
    };
    return () => (
      <div>
        <pre>{formatJson(state.slides)}</pre>
      </div>
    );
  },
});

export default EditorArea;
