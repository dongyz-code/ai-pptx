<template>
  <Transition name="submenu">
    <div
      v-if="visible"
      class="submenu-container"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
    >
      <div class="submenu-content">
        <div class="submenu-title">{{ title }}</div>
        <div class="submenu-items">
          <div
            v-for="item in items"
            :key="item.value"
            class="submenu-item"
            @click="handleItemClick(item)"
          >
            <div v-if="item.icon" class="submenu-item-icon">
              <VIcon :icon="item.icon" />
            </div>
            <div v-if="item.preview" class="submenu-item-preview" v-html="item.preview"></div>
            <div class="submenu-item-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VIcon, IconName } from '@/components/ui';

export interface SubmenuItem {
  label: string;
  value: string;
  icon?: IconName;
  preview?: string;
  data?: any;
}

interface Props {
  visible: boolean;
  title: string;
  items: SubmenuItem[];
  position: { top: number; left: number };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [item: SubmenuItem];
  close: [];
}>();

const handleItemClick = (item: SubmenuItem) => {
  emit('select', item);
  emit('close');
};
</script>

<style scoped>
.submenu-container {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.submenu-content {
  padding: 8px;
}

.submenu-title {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 4px;
}

.submenu-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.submenu-item:hover {
  background-color: #f5f5f5;
}

.submenu-item-icon {
  font-size: 18px;
  color: #666;
}

.submenu-item-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-size: 20px;
}

.submenu-item-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

/* Transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
