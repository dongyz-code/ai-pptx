<template>
  <div
    class="flex items-center justify-between rounded-[7px] border border-black/8 bg-white px-2.5 py-1.5"
  >
    <span class="text-xs text-black/70">{{ label }}</span>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="relative h-[18px] w-8 shrink-0 cursor-pointer rounded-full border-none transition-colors duration-200"
      :class="modelValue ? 'bg-indigo-500' : 'bg-black/15'"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span
        class="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200"
        :class="modelValue ? 'left-0.5 translate-x-3.5' : 'left-0.5'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; modelValue: boolean }>();
defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();
</script>
