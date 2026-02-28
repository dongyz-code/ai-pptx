<template>
  <Teleport to="body">
    <div
      v-if="selectedElement"
      class="fixed z-[99999] flex items-center gap-0.5 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-200/80 px-1.5 py-1 select-none"
      :style="toolbarStyle"
      @mousedown.stop
      @click.stop
    >
      <!-- ── 文本元素 ── -->
      <template v-if="textElement">
        <select
          class="h-7 max-w-[110px] rounded-lg border-0 bg-transparent px-1.5 text-[12px] text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          :value="textElement.defaultFontName || ''"
          @change="setFontFamily"
        >
          <option value="">默认字体</option>
          <option v-for="f in FONT_FAMILIES" :key="f.value" :value="f.value">{{ f.label }}</option>
        </select>

        <div class="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />

        <ColorPickerBtn
          :color="textElement.defaultColor || '#000000'"
          title="文字颜色"
          @change="setTextColor"
        />
      </template>

      <!-- ── 图片元素 ── -->
      <template v-else-if="imageElement">
        <ToolbarBtn title="水平翻转" @click="toggleFlipH">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v18M4 8l-3 4 3 4M20 8l3 4-3 4" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn title="垂直翻转" @click="toggleFlipV">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M8 4l4-3 4 3M8 20l4 3 4-3" />
          </svg>
        </ToolbarBtn>
        <ColorPickerBtn
          :color="imageElement.colorMask || 'transparent'"
          title="颜色蒙版"
          @change="setColorMask"
        />
      </template>

      <!-- ── 形状元素 ── -->
      <template v-else-if="shapeElement">
        <ColorPickerBtn
          :color="shapeElement.fill || '#ffffff'"
          title="填充颜色"
          @change="setShapeFill"
        />
        <ToolbarBtn title="水平翻转" @click="toggleFlipH">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v18M4 8l-3 4 3 4M20 8l3 4-3 4" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn title="垂直翻转" @click="toggleFlipV">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M8 4l4-3 4 3M8 20l4 3 4-3" />
          </svg>
        </ToolbarBtn>
      </template>

      <!-- ── 线条元素 ── -->
      <template v-else-if="lineElement">
        <ColorPickerBtn
          :color="lineElement.color || '#000000'"
          title="线条颜色"
          @change="setLineColor"
        />
        <div class="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <button
            v-for="s in LINE_STYLES"
            :key="s.value"
            :title="s.label"
            class="h-7 w-7 flex items-center justify-center text-[11px] transition-colors hover:bg-slate-200"
            :class="lineElement.style === s.value ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-slate-500'"
            @click="setLineStyle(s.value)"
          >
            <svg width="16" height="4" viewBox="0 0 16 4">
              <line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" stroke-width="2" :stroke-dasharray="s.dash" />
            </svg>
          </button>
        </div>
      </template>

      <!-- ── 视频元素 ── -->
      <template v-else-if="videoElement">
        <!-- autoplay toggle -->
        <button
          class="flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium transition-colors hover:bg-slate-100"
          :class="videoElement.autoplay ? 'text-indigo-600' : 'text-slate-500'"
          title="自动播放"
          @click="toggleAutoplay"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          自动
        </button>
      </template>

      <!-- ── 公共控制 ── -->
      <div class="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />

      <!-- 成组 -->
      <ToolbarBtn :title="groupBtnTitle" @click="toggleGroup">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="8" height="8" rx="1" />
          <rect x="14" y="2" width="8" height="8" rx="1" />
          <rect x="2" y="14" width="8" height="8" rx="1" />
          <rect x="14" y="14" width="8" height="8" rx="1" />
        </svg>
      </ToolbarBtn>

      <!-- 锁定 -->
      <ToolbarBtn :title="isLocked ? '解锁' : '锁定'" :active="isLocked" @click="toggleLock">
        <svg v-if="isLocked" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      </ToolbarBtn>

      <!-- 上移一层 -->
      <ToolbarBtn title="上移一层" @click="moveUp">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="8" width="12" height="12" rx="1.5" />
          <rect x="8" y="4" width="12" height="12" rx="1.5" class="fill-white" />
          <path d="M14 7l-2-3-2 3" />
        </svg>
      </ToolbarBtn>

      <!-- 下移一层 -->
      <ToolbarBtn title="下移一层" @click="moveDown">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="8" y="4" width="12" height="12" rx="1.5" />
          <rect x="4" y="8" width="12" height="12" rx="1.5" class="fill-white" />
          <path d="M10 17l2 3 2-3" />
        </svg>
      </ToolbarBtn>

      <div class="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />

      <!-- 删除 -->
      <ToolbarBtn title="删除" danger @click="deleteEl">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
        </svg>
      </ToolbarBtn>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { useEditor, useSlides } from '../../../models';
import { useSelectedElements } from '../../../hooks';
import { uuid } from '@/utils';
import type {
  PPTElement, PPTTextElement, PPTImageElement,
  PPTShapeElement, PPTLineElement, PPTVideoElement,
} from '@/types';

// ── 内部子组件 ──────────────────────────────────────────────────

/** 通用工具栏按钮 */
const ToolbarBtn = defineComponent({
  props: {
    title: String,
    active: Boolean,
    danger: Boolean,
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => h(
      'button',
      {
        title: props.title,
        class: [
          'h-7 w-7 flex items-center justify-center rounded-lg transition-colors shrink-0',
          props.danger
            ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
            : props.active
              ? 'bg-indigo-100 text-indigo-600'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
        ],
        onClick: (e: MouseEvent) => { e.stopPropagation(); emit('click'); },
      },
      slots.default?.(),
    );
  },
});

/** 颜色选择器按钮 */
const ColorPickerBtn = defineComponent({
  props: {
    color: { type: String, default: '#000000' },
    title: String,
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () => h(
      'label',
      {
        title: props.title,
        class: 'relative h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0',
      },
      [
        h('div', {
          class: 'w-4 h-4 rounded-sm border border-black/10 shadow-sm',
          style: { background: props.color || 'transparent' },
        }),
        h('input', {
          type: 'color',
          class: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
          value: props.color?.startsWith('#') ? props.color : '#000000',
          onInput: (e: Event) => emit('change', (e.target as HTMLInputElement).value),
        }),
      ],
    );
  },
});

// ── 数据 ────────────────────────────────────────────────────────

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
];

const LINE_STYLES = [
  { value: 'solid', label: '实线', dash: 'none' },
  { value: 'dashed', label: '虚线', dash: '5,3' },
  { value: 'dotted', label: '点线', dash: '1,3' },
];

// ── Store ────────────────────────────────────────────────────────

const editor = useEditor();
const slides = useSlides();
const { selectedElements } = useSelectedElements();

// ── 画布位置 ──────────────────────────────────────────────────────

const canvasEl = ref<HTMLElement | null>(null);

onMounted(() => {
  canvasEl.value = document.getElementById('editor-canvas');
});

const { left: canvasLeft, top: canvasTop } = useElementBounding(canvasEl);

// ── 选中元素 ──────────────────────────────────────────────────────

const selectedElement = computed<PPTElement | null>(() => {
  if (selectedElements.value.length !== 1) return null;
  return selectedElements.value[0] ?? null;
});

const textElement = computed<PPTTextElement | null>(() =>
  selectedElement.value?.type === 'text' ? (selectedElement.value as PPTTextElement) : null,
);
const imageElement = computed<PPTImageElement | null>(() =>
  selectedElement.value?.type === 'image' ? (selectedElement.value as PPTImageElement) : null,
);
const shapeElement = computed<PPTShapeElement | null>(() =>
  selectedElement.value?.type === 'shape' ? (selectedElement.value as PPTShapeElement) : null,
);
const lineElement = computed<PPTLineElement | null>(() =>
  selectedElement.value?.type === 'line' ? (selectedElement.value as PPTLineElement) : null,
);
const videoElement = computed<PPTVideoElement | null>(() =>
  selectedElement.value?.type === 'video' ? (selectedElement.value as PPTVideoElement) : null,
);

// ── 定位 ──────────────────────────────────────────────────────────

const toolbarStyle = computed(() => {
  const el = selectedElement.value;
  if (!el) return {};

  const scale = editor.editorState.viewportScale;

  let elLeft: number, elTop: number, elWidth: number;

  if (el.type === 'line') {
    elLeft = Math.min(el.start[0], el.end[0]);
    elTop = Math.min(el.start[1], el.end[1]);
    elWidth = Math.max(Math.abs(el.end[0] - el.start[0]), 40);
  } else {
    elLeft = el.left;
    elTop = el.top;
    elWidth = el.width;
  }

  const centerX = canvasLeft.value + (elLeft + elWidth / 2) * scale;
  const topY = canvasTop.value + elTop * scale;

  return {
    left: `${centerX}px`,
    top: `${topY}px`,
    transform: 'translateX(-50%) translateY(calc(-100% - 8px))',
  };
});

// ── 公共属性 ──────────────────────────────────────────────────────

const isLocked = computed(() => !!selectedElement.value?.lock);

const groupBtnTitle = computed(() => {
  const el = selectedElement.value;
  if (!el) return '成组';
  return 'groupId' in el && el.groupId ? '解组' : '成组';
});

// ── 操作 ──────────────────────────────────────────────────────────

const update = (id: string, props: Partial<PPTElement>) => {
  slides.updateElement({ id, props: props as never });
};

/** 文字颜色 */
const setTextColor = (color: string) => {
  if (textElement.value) update(textElement.value.id, { defaultColor: color });
};

/** 字体 */
const setFontFamily = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  if (textElement.value) update(textElement.value.id, { defaultFontName: val });
};

/** 水平翻转 */
const toggleFlipH = () => {
  const el = imageElement.value || shapeElement.value;
  if (el) update(el.id, { flipH: !el.flipH } as Partial<PPTElement>);
};

/** 垂直翻转 */
const toggleFlipV = () => {
  const el = imageElement.value || shapeElement.value;
  if (el) update(el.id, { flipV: !el.flipV } as Partial<PPTElement>);
};

/** 颜色蒙版 */
const setColorMask = (color: string) => {
  if (imageElement.value) update(imageElement.value.id, { colorMask: color } as Partial<PPTElement>);
};

/** 形状填充 */
const setShapeFill = (color: string) => {
  if (shapeElement.value) update(shapeElement.value.id, { fill: color } as Partial<PPTElement>);
};

/** 线条颜色 */
const setLineColor = (color: string) => {
  if (lineElement.value) update(lineElement.value.id, { color } as Partial<PPTElement>);
};

/** 线条样式 */
const setLineStyle = (style: string) => {
  if (lineElement.value) update(lineElement.value.id, { style } as Partial<PPTElement>);
};

/** 自动播放 */
const toggleAutoplay = () => {
  if (videoElement.value) update(videoElement.value.id, { autoplay: !videoElement.value.autoplay } as Partial<PPTElement>);
};

/** 锁定 */
const toggleLock = () => {
  const el = selectedElement.value;
  if (!el) return;
  update(el.id, { lock: !el.lock } as Partial<PPTElement>);
};

/** 上移一层 */
const moveUp = () => {
  const el = selectedElement.value;
  if (!el) return;
  const elements = [...slides.state.slides[slides.state.sliderIndex].elements];
  const idx = elements.findIndex((e) => e.id === el.id);
  if (idx < elements.length - 1) {
    [elements[idx], elements[idx + 1]] = [elements[idx + 1], elements[idx]];
    slides.setElements(elements);
  }
};

/** 下移一层 */
const moveDown = () => {
  const el = selectedElement.value;
  if (!el) return;
  const elements = [...slides.state.slides[slides.state.sliderIndex].elements];
  const idx = elements.findIndex((e) => e.id === el.id);
  if (idx > 0) {
    [elements[idx], elements[idx - 1]] = [elements[idx - 1], elements[idx]];
    slides.setElements(elements);
  }
};

/** 成组 / 解组 */
const toggleGroup = () => {
  const el = selectedElement.value;
  if (!el) return;

  if ('groupId' in el && el.groupId) {
    // 解组：移除同组所有元素的 groupId
    const groupId = el.groupId;
    const groupElements = slides.state.slides[slides.state.sliderIndex].elements
      .filter((e) => 'groupId' in e && e.groupId === groupId);
    const updates = groupElements.map((e) => ({ id: e.id, props: { groupId: undefined } as Partial<PPTElement> }));
    slides.updateElements(updates as never);
  } else {
    // 仅单个元素时不操作（成组需要多选）
  }
};

/** 删除 */
const deleteEl = () => {
  const el = selectedElement.value;
  if (!el) return;
  slides.deleteElement(el.id);
  editor.setSelectedElementIds([]);
};
</script>
