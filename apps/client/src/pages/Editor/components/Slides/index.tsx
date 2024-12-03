import { defineComponent } from 'vue';
import classNames from 'classnames';
import { useSlides } from '../../models/slider';
import Icon from '@/components/ui/icon';

const Slider = defineComponent({
  name: 'Slider',
  setup() {
    const { state, addSlide, setSlideIndex } = useSlides();

    return () => (
      <div class="scroll-bar w-full overflow-x-auto">
        <div class="flex h-20 py-2">
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
              <span class="absolute bottom-2 left-2 text-xs text-gray-600">{index + 1}</span>
            </div>
          ))}

          <div
            class="flex h-full w-28 flex-shrink-0 cursor-pointer items-center justify-center rounded bg-slate-400 text-xl"
            onClick={() => addSlide()}
          >
            <Icon name="plus" />
          </div>
        </div>
      </div>
    );
  },
});

export default Slider;
