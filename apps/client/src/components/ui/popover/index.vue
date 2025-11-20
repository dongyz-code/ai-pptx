<template>
  <Teleport to="body">
    <Transition name="popover-fade">
      <div
        v-show="visible"
        ref="popoverRef"
        class="v-popover"
        :style="popoverStyle"
        @click.stop
      >
        <div class="v-popover-content">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick } from 'vue';
import { createPopper } from '@popperjs/core';
import type { Instance as PopperInstance, Placement } from '@popperjs/core';

interface Props {
  placement?: Placement;
  offset?: [number, number];
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right-start',
  offset: () => [10, 0],
});

const visible = ref(false);
const popoverRef = ref<HTMLElement>();
let popperInstance: PopperInstance | null = null;
let referenceElement: HTMLElement | null = null;

const popoverStyle = computed(() => ({
  zIndex: 1000,
}));

const show = async (event: Event) => {
  const target = event.currentTarget as HTMLElement;
  if (!target) return;

  referenceElement = target;
  visible.value = true;

  await nextTick();

  if (popoverRef.value && referenceElement) {
    // 销毁旧的 popper 实例
    if (popperInstance) {
      popperInstance.destroy();
    }

    // 创建新的 popper 实例
    popperInstance = createPopper(referenceElement, popoverRef.value, {
      placement: props.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: props.offset,
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
          },
        },
      ],
    });
  }

  // 添加点击外部关闭的监听
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 0);
};

const hide = () => {
  visible.value = false;
  document.removeEventListener('click', handleClickOutside);

  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
};

const toggle = (event: Event) => {
  if (visible.value) {
    hide();
  } else {
    show(event);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    popoverRef.value &&
    !popoverRef.value.contains(target) &&
    referenceElement &&
    !referenceElement.contains(target)
  ) {
    hide();
  }
};

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  if (popperInstance) {
    popperInstance.destroy();
  }
});

defineExpose({
  show,
  hide,
  toggle,
  visible,
});
</script>

<style scoped>
.v-popover {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}

.v-popover-content {
  position: relative;
}

/* Transition */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
