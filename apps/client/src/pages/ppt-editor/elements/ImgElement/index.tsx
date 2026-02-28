import { computed, defineComponent, PropType } from 'vue';
import { useElementFlip } from '../../hooks';
import type { PPTImageElement } from '@/types';

const ImgElement = defineComponent({
  name: 'ImgElement',
  props: {
    element: {
      type: Object as PropType<PPTImageElement>,
      required: true,
    },
    selectElement: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props) {
    const flipH = computed(() => props.element.flipH);
    const flipV = computed(() => props.element.flipV);
    const { flipStyle } = useElementFlip(flipH, flipV);

    const borderStyle = computed(() => {
      const outline = props.element.outline;
      const width = outline?.width ?? 0;
      if (!width) return 'none';
      const color = outline?.color ?? '#111111';
      const style = outline?.style ?? 'solid';
      return `${width}px ${style} ${color}`;
    });

    return () => (
      <div
        id={props.element.id}
        style={{
          position: 'absolute',
          width: `${props.element.width}px`,
          height: `${props.element.height}px`,
          left: `${props.element.left}px`,
          top: `${props.element.top}px`,
          transform: `rotate(${props.element.rotate}deg)`,
        }}
      >
        <div
          class="relative h-full w-full overflow-hidden bg-[#f3f4f6]"
          style={{
            borderRadius: `${props.element.radius ?? 0}px`,
            border: borderStyle.value,
            transform: flipStyle.value,
          }}
        >
          {props.element.src ? (
            <img
              src={props.element.src}
              class="h-full w-full object-cover select-none"
              draggable={false}
            />
          ) : (
            <div class="flex h-full w-full items-center justify-center text-xs tracking-[0.2em] text-black/40">
              IMAGE
            </div>
          )}
        </div>

        <div class="absolute inset-0 cursor-move" onMousedown={props.selectElement}></div>
      </div>
    );
  },
});

export default ImgElement;
