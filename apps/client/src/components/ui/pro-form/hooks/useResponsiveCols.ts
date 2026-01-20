import { computed, onMounted, onUnmounted, ref } from 'vue';

export function useResponsiveCols() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

  const updateWidth = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWidth);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWidth);
    }
  });

  const currentCols = computed(() => {
    if (width.value >= 1280) {
      return 4;
    }
    if (width.value >= 1024) {
      return 3;
    }
    if (width.value >= 768) {
      return 2;
    }
    return 1;
  });

  return { currentCols, width };
}
