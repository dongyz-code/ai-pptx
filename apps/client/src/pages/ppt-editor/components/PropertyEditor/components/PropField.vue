<template>
  <div class="flex flex-col gap-[5px]">
    <label class="text-[11px] font-medium tracking-[0.03em] text-black/45">{{ label }}</label>
    <div class="relative flex items-center">
      <input
        class="h-8 w-full rounded-[7px] border border-black/10 bg-white px-2.5 text-[12.5px] text-[#1a1a2e] transition-[border-color,box-shadow] duration-150 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.12)] [[type=color]]:cursor-pointer [[type=color]]:px-1.5 [[type=color]]:py-0.5"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :placeholder="placeholder"
        @change="$emit('change', $event)"
        @input="type === 'color' ? $emit('change', $event) : undefined"
      />
      <span v-if="unit" class="pointer-events-none absolute right-2 text-[11px] text-black/35">{{
        unit
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue?: string | number;
  type?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  unit?: string;
  placeholder?: string;
}>();

defineEmits<{ (e: 'change', event: Event): void }>();
</script>
