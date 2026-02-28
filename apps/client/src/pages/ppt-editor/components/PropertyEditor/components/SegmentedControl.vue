<template>
  <div class="flex gap-0.5 rounded-[7px] bg-black/5 p-0.5">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :title="opt.label"
      class="h-[26px] flex-1 cursor-pointer rounded-[5px] border-none text-[11px] whitespace-nowrap transition-all duration-150"
      :class="
        modelValue === opt.value
          ? 'bg-white font-semibold text-indigo-500 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
          : 'bg-transparent text-black/55 hover:text-black/80'
      "
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: { value: string; label: string }[];
}>();
defineEmits<{ (e: 'update:modelValue', v: string): void }>();
</script>
