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
    const opacity = computed(() => (props.element as { opacity?: number }).opacity ?? 1);

    const borderStyle = computed(() => {
      const outline = props.element.outline;
      const width = outline?.width ?? 0;
      if (!width) return 'none';
      const color = outline?.color ?? '#111111';
      const style = outline?.style ?? 'solid';
      return `${width}px ${style} ${color}`;
    });

    const filterStyle = computed(() => {
      const filters = props.element.filters;
      if (!filters) return 'none';
      const parts: string[] = [];
      const push = (name: string, value?: string) => {
        if (value === undefined || value === '') return;
        parts.push(`${name}(${value})`);
      };
      push('blur', filters.blur);
      push('brightness', filters.brightness);
      push('contrast', filters.contrast);
      push('grayscale', filters.grayscale);
      push('saturate', filters.saturate);
      push('sepia', filters.sepia);
      push('invert', filters.invert);
      push('opacity', filters.opacity);
      return parts.length ? parts.join(' ') : 'none';
    });

    const clipPath = computed(() => {
      const clip = props.element.clip;
      if (!clip || clip.shape !== 'rect') return undefined;
      const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
      const [[x1, y1], [x2, y2]] = clip.range;
      const left = clampPercent(x1);
      const top = clampPercent(y1);
      const right = clampPercent(100 - x2);
      const bottom = clampPercent(100 - y2);
      return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
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
          opacity: opacity.value,
        }}
      >
        <div
          class="relative h-full w-full overflow-hidden bg-[#f3f4f6]"
          style={{
            borderRadius: `${props.element.radius ?? 0}px`,
            border: borderStyle.value,
            transform: flipStyle.value,
            filter: filterStyle.value,
            clipPath: clipPath.value,
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
