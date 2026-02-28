<template>
  <div class="space-y-3 p-1">
    <section class="rounded-xl border border-black/10 bg-white p-2.5">
      <div class="mb-2 text-xs font-medium tracking-[0.22em] text-black/45">图片来源</div>
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
          v-model.trim="imageUrl"
          type="url"
          class="h-9 w-full rounded-lg border border-black/15 px-3 text-sm transition outline-none focus:border-black"
          placeholder="https://example.com/image.png"
          @keydown.enter.prevent="onAddByUrl"
        />
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
    </section>

    <section class="rounded-xl border border-black/10 bg-white p-2.5">
      <div class="mb-2 text-xs font-medium tracking-[0.22em] text-black/45">快速图片</div>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="option in presets"
          :key="option.value"
          class="group cursor-grab rounded-lg border border-black/10 p-1.5 transition hover:border-black hover:bg-black active:cursor-grabbing"
          draggable="true"
          :title="option.label"
          @click="onSelectPreset(option)"
          @dragstart="onDragStart($event, option)"
        >
          <div class="overflow-hidden rounded-md border border-black/10 bg-white">
            <img :src="option.data.src" class="h-16 w-full object-cover" draggable="false" />
          </div>
          <div class="mt-1 text-center text-xs text-black group-hover:text-white">
            {{ option.label }}
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
import type { PPTImageElement } from '@/types';

type ImageElementTemplate = Omit<PPTImageElement, 'id' | 'left' | 'top'>;

interface ImagePresetOption {
  label: string;
  value: string;
  data: ImageElementTemplate;
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { onAddImage } = useAction();
const imageUrl = ref('');
const fileInput = ref<HTMLInputElement>();

const createSvgImage = (background: string, foreground: string, label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${background}"/><stop offset="100%" stop-color="#000000"/></linearGradient></defs><rect width="800" height="480" fill="url(#g)"/><circle cx="180" cy="140" r="64" fill="${foreground}" opacity="0.65"/><rect x="140" y="250" width="520" height="10" rx="5" fill="${foreground}" opacity="0.75"/><rect x="140" y="280" width="420" height="10" rx="5" fill="${foreground}" opacity="0.5"/><text x="140" y="220" font-family="Arial, sans-serif" font-size="42" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const presets: ImagePresetOption[] = [
  {
    label: '海报感',
    value: 'poster',
    data: {
      type: 'image',
      width: 420,
      height: 252,
      rotate: 0,
      fixedRatio: true,
      src: createSvgImage('#18181b', '#ffffff', 'Poster Frame'),
    },
  },
  {
    label: '极简白',
    value: 'minimal',
    data: {
      type: 'image',
      width: 420,
      height: 252,
      rotate: 0,
      fixedRatio: true,
      src: createSvgImage('#f4f4f5', '#111111', 'Minimal Image'),
    },
  },
  {
    label: '封面图',
    value: 'cover',
    data: {
      type: 'image',
      width: 480,
      height: 270,
      rotate: 0,
      fixedRatio: true,
      src: createSvgImage('#0f172a', '#e2e8f0', 'Cover Asset'),
      radius: 16,
    },
  },
  {
    label: '卡片图',
    value: 'card',
    data: {
      type: 'image',
      width: 360,
      height: 240,
      rotate: 0,
      fixedRatio: true,
      src: createSvgImage('#fafafa', '#18181b', 'Card Image'),
      radius: 12,
      outline: {
        width: 1,
        color: '#111111',
        style: 'solid',
      },
    },
  },
];

const onSelectPreset = (option: ImagePresetOption) => {
  onAddImage(option.data);
  emit('close');
};

const onDragStart = (event: DragEvent, option: ImagePresetOption) => {
  startElementDrag(event, option.data, option.label);
};

const handleUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result as string;
    if (!src) return;

    onAddImage({
      src,
      fixedRatio: true,
    });
    emit('close');
  };

  reader.readAsDataURL(file);
  input.value = '';
};

const onAddByUrl = () => {
  const url = imageUrl.value.trim();
  if (!url) return;

  onAddImage({
    src: url,
    fixedRatio: true,
  });
  imageUrl.value = '';
  emit('close');
};
</script>
