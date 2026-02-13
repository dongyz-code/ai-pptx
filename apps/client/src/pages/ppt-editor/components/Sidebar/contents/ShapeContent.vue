<template>
  <div class="scroll-bar max-h-[560px] max-w-[560px] min-w-[420px] overflow-y-auto p-3">
    <div class="flex flex-col gap-[14px]">
      <div v-for="group in shapeGroups" :key="group.label" class="flex flex-col gap-2">
        <div class="px-1 pt-1 text-sm font-semibold text-gray-600">{{ group.label }}</div>
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="option in group.items"
            :key="option.value"
            class="flex cursor-grab flex-col items-center gap-1 rounded-lg border border-[#e5e5e5] bg-white p-1.5 transition-all duration-200 hover:border-[#c9c9c9] hover:bg-gray-100 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:cursor-grabbing"
            draggable="true"
            @dragstart="($event: DragEvent) => onDragStart($event, option)"
            @click="handleClick(option)"
            :title="option.label"
          >
            <div class="flex h-6 w-6 items-center justify-center" v-html="option.preview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { startElementDrag } from '../../../hooks/useDragCreate';
import { useAction } from '../useAction';
import { shapeGroups, type ShapeOption } from './shapes';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { onAddShape } = useAction();

const handleClick = (option: ShapeOption) => {
  onAddShape(option.data);
  emit('close');
};

const onDragStart = (event: DragEvent, option: ShapeOption) => {
  startElementDrag(event, option.data, option.label);
};
</script>
