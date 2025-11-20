<template>
  <div class="sidebar-container p-4">
    <div
      v-for="action in actions"
      :key="action.value"
      class="sidebar-item flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg text-center font-bold text-gray-600 transition-all hover:shadow-md"
      :class="{ 'bg-blue-50 shadow-md': activeAction === action.value }"
      @click="handleActionClick(action, $event)"
    >
      <div class="text-lg">
        <VIcon :icon="action.icon" />
      </div>
      <div class="text-xs">{{ action.label }}</div>
    </div>

    <!-- 文字 Popover -->
    <VPopover ref="textPopoverRef">
      <TextContent @select="handleTextSelect" />
    </VPopover>

    <!-- 形状 Popover -->
    <VPopover ref="shapePopoverRef">
      <ShapeContent @select="handleShapeSelect" />
    </VPopover>

    <!-- 线条 Popover -->
    <VPopover ref="linePopoverRef">
      <LineContent @select="handleLineSelect" />
    </VPopover>

    <!-- 图片 Popover -->
    <VPopover ref="imagePopoverRef">
      <ImageContent @select="handleImageSelect" />
    </VPopover>

    <!-- 表格 Popover -->
    <VPopover ref="tablePopoverRef">
      <TableContent @select="handleTableSelect" />
    </VPopover>

    <!-- 图表 Popover -->
    <VPopover ref="chartPopoverRef">
      <ChartContent @select="handleChartSelect" />
    </VPopover>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VIcon, VPopover, IconName } from '@/components/ui';
import { useAction } from './useAction';
import TextContent from './contents/TextContent.vue';
import ShapeContent from './contents/ShapeContent.vue';
import LineContent from './contents/LineContent.vue';
import ImageContent from './contents/ImageContent.vue';
import TableContent from './contents/TableContent.vue';
import ChartContent from './contents/ChartContent.vue';

type ActionType = 'text' | 'shape' | 'line' | 'image' | 'table' | 'chart';

const { onAddText, onAddShape, onAddLine, onAddImage, onAddTable, onAddChart } = useAction();

const actions: { label: string; value: ActionType; icon: IconName }[] = [
  {
    label: '文字',
    value: 'text',
    icon: 'solar:text-bold',
  },
  {
    label: '形状',
    value: 'shape',
    icon: 'fluent:shapes-24-regular',
  },
  {
    label: '线条',
    value: 'line',
    icon: 'uil:line-alt',
  },
  {
    label: '图片',
    value: 'image',
    icon: 'mage:image-fill',
  },
  {
    label: '表格',
    value: 'table',
    icon: 'majesticons:table',
  },
  {
    label: '图表',
    value: 'chart',
    icon: 'teenyicons:donut-chart-solid',
  },
];

// Popover refs
const textPopoverRef = ref();
const shapePopoverRef = ref();
const linePopoverRef = ref();
const imagePopoverRef = ref();
const tablePopoverRef = ref();
const chartPopoverRef = ref();

const activeAction = ref<ActionType>();
const currentPopoverRef = ref<any>();

// 处理主菜单点击
const handleActionClick = (action: typeof actions[0], event: MouseEvent) => {
  // 如果点击的是已经激活的菜单，则关闭
  if (activeAction.value === action.value && currentPopoverRef.value?.visible) {
    currentPopoverRef.value.hide();
    activeAction.value = undefined;
    currentPopoverRef.value = null;
    return;
  }

  // 关闭之前打开的 popover
  if (currentPopoverRef.value && currentPopoverRef.value.visible) {
    currentPopoverRef.value.hide();
  }

  // 根据不同的 action 显示不同的 popover
  let popoverRef;
  switch (action.value) {
    case 'text':
      popoverRef = textPopoverRef.value;
      break;
    case 'shape':
      popoverRef = shapePopoverRef.value;
      break;
    case 'line':
      popoverRef = linePopoverRef.value;
      break;
    case 'image':
      popoverRef = imagePopoverRef.value;
      break;
    case 'table':
      popoverRef = tablePopoverRef.value;
      break;
    case 'chart':
      popoverRef = chartPopoverRef.value;
      break;
  }

  if (popoverRef) {
    activeAction.value = action.value;
    currentPopoverRef.value = popoverRef;
    // 立即显示 popover
    popoverRef.show(event);
  }
};

// 处理文字选择
const handleTextSelect = (option: any) => {
  const { content, fontSize, fontWeight } = option.data;
  const fontSizeValue = parseInt(fontSize);

  // 构建 HTML 内容
  const htmlContent = `<p style="font-size: ${fontSize}; font-weight: ${fontWeight};">${content}</p>`;

  onAddText({
    content: htmlContent,
    height: fontSizeValue + 20,
    width: content.length * fontSizeValue + 40,
  });

  textPopoverRef.value?.hide();
  activeAction.value = undefined;
};

// 处理形状选择
const handleShapeSelect = (option: any) => {
  const { viewBox, path, fill, pathFormula } = option.data;

  onAddShape({
    viewBox,
    path,
    fill,
    pathFormula,
  });

  shapePopoverRef.value?.hide();
  activeAction.value = undefined;
};

// 处理线条选择
const handleLineSelect = (option: any) => {
  const { style, points, color } = option.data;

  onAddLine({
    style,
    points,
    color,
  });

  linePopoverRef.value?.hide();
  activeAction.value = undefined;
};

// 处理图片选择
const handleImageSelect = (option: any) => {
  const { src } = option;

  if (src) {
    onAddImage({
      src,
    });
  }

  imagePopoverRef.value?.hide();
  activeAction.value = undefined;
};

// 处理表格选择
const handleTableSelect = (option: any) => {
  const { rows, cols } = option.data;

  onAddTable({
    rows,
    cols,
  });

  tablePopoverRef.value?.hide();
  activeAction.value = undefined;
};

// 处理图表选择
const handleChartSelect = (option: any) => {
  const { chartType } = option.data;

  onAddChart({
    chartType,
  });

  chartPopoverRef.value?.hide();
  activeAction.value = undefined;
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  position: relative;
}
</style>
