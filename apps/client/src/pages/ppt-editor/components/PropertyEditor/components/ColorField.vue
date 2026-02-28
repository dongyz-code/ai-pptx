<template>
  <div class="flex flex-col gap-[5px]">
    <span class="text-[11px] font-medium tracking-[0.03em] text-black/45">{{ label }}</span>
    <div
      class="flex h-8 items-center gap-1.5 rounded-[7px] border border-black/10 bg-white px-1.5 transition-[border-color,box-shadow] duration-150 focus-within:border-indigo-500 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.12)]"
    >
      <div class="relative h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded-[4px]">
        <input
          type="color"
          :value="modelValue || '#000000'"
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          @input="onInput"
        />
        <span
          class="block h-5 w-5 rounded-[4px] border border-black/10"
          :style="{ background: modelValue || '#000000' }"
        />
      </div>
      <input
        type="text"
        class="flex-1 border-none bg-transparent font-mono text-xs text-[#1a1a2e] outline-none"
        :value="modelValue || ''"
        :placeholder="placeholder || '#000000'"
        @change="onTextChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};

const onTextChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value.trim();
  if (val) emit('update:modelValue', val);
};
</script>
