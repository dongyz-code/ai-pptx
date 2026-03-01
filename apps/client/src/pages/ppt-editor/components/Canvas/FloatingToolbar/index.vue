<template>
  <Teleport to="body">
    <div
      v-if="selectedElement"
      class="fixed z-[99999] flex items-center gap-0.5 rounded-xl border border-slate-200/80 bg-white px-1.5 py-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)] select-none"
      :style="toolbarStyle"
      @mousedown.stop
      @click.stop
    >
      <template v-if="selectedElement.type === 'text'">
        <select
          class="h-7 max-w-[110px] cursor-pointer rounded-lg border-0 bg-transparent px-1.5 text-[12px] text-slate-700 transition-colors outline-none hover:bg-slate-100"
          :value="selectedElement.defaultFontName || ''"
          @change="setFontFamily"
        >
          <option value="">默认字体</option>
          <option v-for="font in FONT_FAMILIES" :key="font.value" :value="font.value">
            {{ font.label }}
          </option>
        </select>

        <div class="mx-0.5 h-5 w-px shrink-0 bg-slate-200" />

        <ColorPickerBtn
          :color="selectedElement.defaultColor || '#000000'"
          title="文字颜色"
          @change="setTextColor"
        />
      </template>

      <template v-else-if="selectedElement.type === 'image'">
        <ToolbarBtn title="水平翻转" @click="toggleFlipH">
          <VIcon icon="mdi:flip-horizontal" :size="14" />
        </ToolbarBtn>
        <ToolbarBtn title="垂直翻转" @click="toggleFlipV">
          <VIcon icon="mdi:flip-vertical" :size="14" />
        </ToolbarBtn>
        <ColorPickerBtn
          :color="selectedElement.colorMask || 'transparent'"
          title="颜色蒙版"
          @change="setColorMask"
        />
      </template>

      <template v-else-if="selectedElement.type === 'shape'">
        <ColorPickerBtn
          :color="selectedElement.fill || '#ffffff'"
          title="填充颜色"
          @change="setShapeFill"
        />
        <ToolbarBtn title="水平翻转" @click="toggleFlipH">
          <VIcon icon="mdi:flip-horizontal" :size="14" />
        </ToolbarBtn>
        <ToolbarBtn title="垂直翻转" @click="toggleFlipV">
          <VIcon icon="mdi:flip-vertical" :size="14" />
        </ToolbarBtn>
      </template>

      <template v-else-if="selectedElement.type === 'line'">
        <ColorPickerBtn
          :color="selectedElement.color || '#000000'"
          title="线条颜色"
          @change="setLineColor"
        />
        <div class="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <button
            v-for="style in LINE_STYLES"
            :key="style.value"
            :title="style.label"
            class="flex h-7 w-7 items-center justify-center text-[11px] transition-colors hover:bg-slate-200"
            :class="
              selectedElement.style === style.value
                ? 'bg-indigo-100 font-semibold text-indigo-600'
                : 'text-slate-500'
            "
            @click="setLineStyle(style.value)"
          >
            <VIcon :icon="style.icon" :size="16" />
          </button>
        </div>
      </template>

      <template v-else-if="selectedElement.type === 'video'">
        <button
          class="flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium transition-colors hover:bg-slate-100"
          :class="selectedElement.autoplay ? 'text-indigo-600' : 'text-slate-500'"
          title="自动播放"
          @click="toggleAutoplay"
        >
          <VIcon icon="mdi:play" :size="12" />
          自动
        </button>
      </template>

      <div class="mx-0.5 h-5 w-px shrink-0 bg-slate-200" />

      <ToolbarBtn :title="groupBtnTitle" @click="toggleGroup">
        <VIcon icon="mdi:vector-union" :size="14" />
      </ToolbarBtn>

      <ToolbarBtn :title="isLocked ? '解锁' : '锁定'" :active="isLocked" @click="toggleLock">
        <VIcon :icon="isLocked ? 'mdi:lock' : 'mdi:lock-open-variant'" :size="14" />
      </ToolbarBtn>

      <ToolbarBtn title="上移一层" @click="moveUp">
        <VIcon icon="mdi:arrow-up-bold" :size="14" />
      </ToolbarBtn>

      <ToolbarBtn title="下移一层" @click="moveDown">
        <VIcon icon="mdi:arrow-down-bold" :size="14" />
      </ToolbarBtn>

      <div class="mx-0.5 h-5 w-px shrink-0 bg-slate-200" />

      <ToolbarBtn title="删除" danger @click="deleteEl">
        <VIcon icon="mdi:delete-outline" :size="14" />
      </ToolbarBtn>
    </div>
  </Teleport>
</template>

<script setup lang="tsx">
import { computed, defineComponent, h, onMounted, ref, type CSSProperties } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { useEditor, useSlides } from '../../../models';
import { useSelectedElements } from '../../../hooks';
import { VIcon, type IconName } from '@/components/ui';
import type { PPTElement } from '@/types';

type LineStyle = 'solid' | 'dashed' | 'dotted';
type ElementType = PPTElement['type'];
type ElementByType<T extends ElementType> = Extract<PPTElement, { type: T }>;

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'SimSun', label: '宋体' },
  { value: 'SimHei', label: '黑体' },
] as const;

const LINE_STYLES: ReadonlyArray<{ value: LineStyle; label: string; icon: IconName }> = [
  { value: 'solid', label: '实线', icon: 'mdi:minus' },
  { value: 'dashed', label: '虚线', icon: 'mdi:dots-horizontal' },
  { value: 'dotted', label: '点线', icon: 'mdi:dots-horizontal' },
];

const ToolbarBtn = defineComponent({
  name: 'ToolbarBtn',
  props: {
    title: { type: String, default: '' },
    active: { type: Boolean, default: false },
    danger: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      emit('click');
    };

    return () =>
      h(
        'button',
        {
          title: props.title,
          class: [
            'h-7 w-7 flex shrink-0 items-center justify-center rounded-lg transition-colors',
            props.danger
              ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
              : props.active
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
          ],
          onClick: handleClick,
        },
        slots.default?.()
      );
  },
});

const ColorPickerBtn = defineComponent({
  name: 'ColorPickerBtn',
  props: {
    color: { type: String, default: '#000000' },
    title: { type: String, default: '' },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const handleInput = (e: Event) => {
      emit('change', (e.target as HTMLInputElement).value);
    };

    return () =>
      h(
        'label',
        {
          title: props.title,
          class:
            'relative h-7 w-7 shrink-0 cursor-pointer rounded-lg transition-colors hover:bg-slate-100',
        },
        [
          h('div', {
            class: 'absolute inset-0 m-auto h-4 w-4 rounded-sm border border-black/10 shadow-sm',
            style: { background: props.color || 'transparent' },
          }),
          h('input', {
            type: 'color',
            class: 'absolute inset-0 h-full w-full cursor-pointer opacity-0',
            value: props.color.startsWith('#') ? props.color : '#000000',
            onInput: handleInput,
          }),
        ]
      );
  },
});

const editor = useEditor();
const slides = useSlides();
const { selectedElements } = useSelectedElements();

const canvasEl = ref<HTMLElement | null>(null);
onMounted(() => {
  canvasEl.value = document.getElementById('editor-canvas');
});

const { left: canvasLeft, top: canvasTop } = useElementBounding(canvasEl);

const selectedElement = computed<PPTElement | null>(() => {
  if (selectedElements.value.length !== 1) return null;
  return selectedElements.value[0] ?? null;
});

const getCurrentSlideElements = () => slides.state.slides[slides.state.sliderIndex]?.elements ?? [];
const selectedOf = <T extends ElementType>(type: T): ElementByType<T> | null => {
  const el = selectedElement.value;
  if (!el || el.type !== type) return null;
  return el as ElementByType<T>;
};

const toolbarStyle = computed<CSSProperties>(() => {
  const el = selectedElement.value;
  if (!el) return {};

  const scale = editor.editorState.viewportScale;

  let elLeft = 0;
  let elTop = 0;
  let elWidth = 0;

  if (el.type === 'line') {
    elLeft = Math.min(el.start[0], el.end[0]);
    elTop = Math.min(el.start[1], el.end[1]);
    elWidth = Math.max(Math.abs(el.end[0] - el.start[0]), 40);
  } else {
    elLeft = el.left;
    elTop = el.top;
    elWidth = el.width;
  }

  return {
    left: `${canvasLeft.value + (elLeft + elWidth / 2) * scale}px`,
    top: `${canvasTop.value + elTop * scale}px`,
    transform: 'translateX(-50%) translateY(calc(-100% - 8px))',
  };
});

const isLocked = computed(() => Boolean(selectedElement.value?.lock));
const groupBtnTitle = computed(() => {
  const el = selectedElement.value;
  if (!el) return '成组';
  return 'groupId' in el && el.groupId ? '解组' : '成组';
});

const updateElement = <T extends PPTElement>(el: T | null, props: Partial<T>) => {
  if (!el) return;
  slides.updateElement({ id: el.id, props: props as never });
};

const setTextColor = (color: string) => {
  updateElement(selectedOf('text'), { defaultColor: color });
};

const setFontFamily = (e: Event) => {
  updateElement(selectedOf('text'), { defaultFontName: (e.target as HTMLSelectElement).value });
};

const toggleFlipH = () => {
  const target = selectedOf('image') ?? selectedOf('shape');
  if (!target) return;
  updateElement(target, { flipH: !target.flipH });
};

const toggleFlipV = () => {
  const target = selectedOf('image') ?? selectedOf('shape');
  if (!target) return;
  updateElement(target, { flipV: !target.flipV });
};

const setColorMask = (color: string) => {
  updateElement(selectedOf('image'), { colorMask: color });
};

const setShapeFill = (color: string) => {
  updateElement(selectedOf('shape'), { fill: color });
};

const setLineColor = (color: string) => {
  updateElement(selectedOf('line'), { color });
};

const setLineStyle = (style: LineStyle) => {
  updateElement(selectedOf('line'), { style });
};

const toggleAutoplay = () => {
  const video = selectedOf('video');
  if (!video) return;
  updateElement(video, { autoplay: !video.autoplay });
};

const toggleLock = () => {
  updateElement(selectedElement.value, { lock: !isLocked.value });
};

const moveBy = (delta: -1 | 1) => {
  const el = selectedElement.value;
  if (!el) return;

  const elements = [...getCurrentSlideElements()];
  const currentIndex = elements.findIndex((item) => item.id === el.id);
  const targetIndex = currentIndex + delta;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= elements.length) return;

  [elements[currentIndex], elements[targetIndex]] = [elements[targetIndex], elements[currentIndex]];
  slides.setElements(elements);
};

const moveUp = () => moveBy(1);
const moveDown = () => moveBy(-1);

const toggleGroup = () => {
  const el = selectedElement.value;
  if (!el || !('groupId' in el) || !el.groupId) return;

  const updates = getCurrentSlideElements()
    .filter((item) => 'groupId' in item && item.groupId === el.groupId)
    .map((item) => ({
      id: item.id,
      props: { groupId: undefined } as Partial<PPTElement>,
    }));

  if (updates.length > 0) {
    slides.updateElements(updates as never);
  }
};

const deleteEl = () => {
  const el = selectedElement.value;
  if (!el) return;
  slides.deleteElement(el.id);
  editor.setSelectedElementIds([]);
};
</script>
