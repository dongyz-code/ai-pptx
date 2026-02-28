<template>
  <div class="space-y-3 p-1">
    <section class="rounded-xl border border-black/10 bg-white p-2.5">
      <div class="mb-2 text-xs font-medium tracking-[0.22em] text-black/45">视频来源</div>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded-lg border border-black/15 px-3 py-2 text-sm text-black transition hover:bg-black hover:text-white"
          @click="handleUpload"
        >
          本地上传
        </button>
        <button
          type="button"
          class="rounded-lg border border-black/15 px-3 py-2 text-sm text-black transition hover:bg-black hover:text-white"
          @click="onAddByUrl"
        >
          添加链接
        </button>
      </div>

      <div class="mt-2 flex gap-2">
        <input
          v-model.trim="videoUrl"
          type="url"
          class="h-9 w-full rounded-lg border border-black/15 px-3 text-sm transition outline-none focus:border-black"
          placeholder="https://example.com/video.mp4"
          @keydown.enter.prevent="onAddByUrl"
        />
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="video/*"
        class="hidden"
        @change="handleFileChange"
      />
    </section>

    <section class="rounded-xl border border-black/10 bg-white p-2.5">
      <div class="mb-2 text-xs font-medium tracking-[0.22em] text-black/45">快速视频</div>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="option in presets"
          :key="option.value"
          class="group flex cursor-grab items-center gap-3 rounded-lg border border-black/10 p-2 transition hover:border-black hover:bg-black active:cursor-grabbing"
          draggable="true"
          :title="option.label"
          @click="onSelectPreset(option)"
          @dragstart="onDragStart($event, option)"
        >
          <div
            class="flex h-11 w-16 items-center justify-center rounded-md border border-black/15 bg-black text-xs tracking-[0.2em] text-white"
          >
            MP4
          </div>
          <div>
            <div class="text-sm text-black group-hover:text-white">{{ option.label }}</div>
            <div class="text-xs text-black/50 group-hover:text-white/70">{{ option.desc }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { startElementDrag } from '../../../hooks/useDragCreate';
import { useAction } from '../useAction';
import type { PPTVideoElement } from '@/types';

type VideoElementTemplate = Omit<PPTVideoElement, 'id' | 'left' | 'top'>;

interface VideoPresetOption {
  label: string;
  desc: string;
  value: string;
  data: VideoElementTemplate;
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { onAddVideo } = useAction();
const videoUrl = ref('');
const fileInput = ref<HTMLInputElement>();

const presets: VideoPresetOption[] = [
  {
    label: '视频占位框',
    desc: '先放版式，再在右侧填地址',
    value: 'empty-video',
    data: {
      type: 'video',
      width: 420,
      height: 236,
      rotate: 0,
      src: '',
      autoplay: false,
    },
  },
  {
    label: '默认视频',
    desc: '带示例地址，可直接替换',
    value: 'sample-video',
    data: {
      type: 'video',
      width: 420,
      height: 236,
      rotate: 0,
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      autoplay: false,
      ext: 'mp4',
    },
  },
  {
    label: '自动播放',
    desc: '适合封面背景视频',
    value: 'autoplay-video',
    data: {
      type: 'video',
      width: 520,
      height: 292,
      rotate: 0,
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      autoplay: true,
      ext: 'mp4',
    },
  },
];

const onSelectPreset = (option: VideoPresetOption) => {
  onAddVideo(option.data);
  emit('close');
};

const onDragStart = (event: DragEvent, option: VideoPresetOption) => {
  startElementDrag(event, option.data, option.label);
};

const handleUpload = () => {
  fileInput.value?.click();
};

const getFileExt = (name: string) => {
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === name.length - 1) return undefined;
  return name.slice(lastDot + 1).toLowerCase();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const src = URL.createObjectURL(file);
  onAddVideo({
    src,
    ext: getFileExt(file.name),
    autoplay: false,
  });
  emit('close');
  input.value = '';
};

const onAddByUrl = () => {
  const url = videoUrl.value.trim();
  if (!url) return;

  onAddVideo({
    src: url,
    ext: getFileExt(url),
    autoplay: false,
  });
  videoUrl.value = '';
  emit('close');
};
</script>
