import { defineComponent, PropType } from 'vue';
import type { PPTVideoElement } from '@/types';

const VideoElement = defineComponent({
  name: 'VideoElement',
  props: {
    element: {
      type: Object as PropType<PPTVideoElement>,
      required: true,
    },
    selectElement: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props) {
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
        <div class="relative h-full w-full overflow-hidden rounded-md border border-black/15 bg-black">
          {props.element.src ? (
            <video
              src={props.element.src}
              poster={props.element.poster}
              autoplay={props.element.autoplay}
              muted
              loop
              playsinline
              class="pointer-events-none h-full w-full object-cover"
            />
          ) : (
            <div class="flex h-full w-full items-center justify-center text-xs tracking-[0.2em] text-white/70">
              VIDEO
            </div>
          )}
        </div>

        <div class="absolute inset-0 cursor-move" onMousedown={props.selectElement}></div>
      </div>
    );
  },
});

export default VideoElement;
