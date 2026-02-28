<template>
  <section class="overflow-hidden rounded-[10px] border border-black/[0.07] bg-[#fafafa]">
    <div
      class="flex items-center gap-1.5 border-b border-black/6 bg-white px-3 py-2 text-xs font-semibold text-[#1a1a2e]"
    >
      <slot name="icon" />
      <span>{{ title }}</span>
    </div>
    <div class="flex flex-col gap-2 p-3">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
