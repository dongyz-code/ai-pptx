import { defineComponent, ref, toRef } from 'vue';
import classNames from 'classnames';
import { useSlides } from '../../models/slider';
import { useDraggable } from 'vue-draggable-plus';

import { VIcon } from '@/components/ui';

const Slider = defineComponent({
  name: 'PptSlides',
  setup() {
    const dragRef = ref<HTMLElement | null>(null);
    const { state, addSlide, setSlideIndex, setSlides } = useSlides();
    const slides = toRef(state.slides);
    useDraggable(dragRef, slides, {
      onEnd: () => {
        setSlides(slides.value);
      },
    });

    return () => (
      <div class="scroll-bar w-full overflow-x-auto">
        <div ref={dragRef} class="flex h-20 justify-center py-2">
          {state.slides.map((slide, index) => (
            <div
              key={slide.id}
              class={classNames(
                'bg-primary-300 relative mr-4 h-full w-28 flex-shrink-0 cursor-pointer rounded border-2 border-transparent',
                {
                  'ml-2': index === 0,
                  'border-primary': index === state.sliderIndex,
                }
              )}
              onClick={() => setSlideIndex(index)}
            >
              <span class="absolute bottom-2 left-2 text-xs text-gray-600">{slide.id}</span>
            </div>
          ))}

          <div
            class="flex h-full w-28 flex-shrink-0 cursor-pointer items-center justify-center rounded bg-slate-400 text-xl text-white"
            onClick={() => addSlide()}
          >
            <VIcon icon="mdi:plus" />
          </div>
        </div>
      </div>
    );
  },
});

export default Slider;
