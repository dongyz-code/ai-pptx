<template>
  <div class="table-content">
    <div class="content-title">选择表格</div>
    <div class="table-options">
      <div
        v-for="option in tableOptions"
        :key="option.value"
        class="table-option"
        @click="handleSelect(option)"
      >
        <div class="table-preview" v-html="option.preview"></div>
        <div class="table-label">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TableOption {
  label: string;
  value: string;
  preview: string;
  data: {
    rows: number;
    cols: number;
  };
}

const tableOptions: TableOption[] = [
  {
    label: '2×2',
    value: '2x2',
    preview:
      '<svg viewBox="0 0 60 40" width="60" height="40"><rect x="5" y="5" width="25" height="15" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="30" y="5" width="25" height="15" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="20" width="25" height="15" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="30" y="20" width="25" height="15" fill="none" stroke="#4A90E2" stroke-width="1.5"/></svg>',
    data: {
      rows: 2,
      cols: 2,
    },
  },
  {
    label: '3×3',
    value: '3x3',
    preview:
      '<svg viewBox="0 0 60 40" width="60" height="40"><rect x="5" y="2" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="2" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="2" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="14" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="14" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="14" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="26" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="26" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="26" width="15" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/></svg>',
    data: {
      rows: 3,
      cols: 3,
    },
  },
  {
    label: '3×4',
    value: '3x4',
    preview:
      '<svg viewBox="0 0 60 40" width="60" height="40"><rect x="3" y="2" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="15" y="2" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="27" y="2" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="39" y="2" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="3" y="14" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="15" y="14" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="27" y="14" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="39" y="14" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="3" y="26" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="15" y="26" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="27" y="26" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="39" y="26" width="12" height="12" fill="none" stroke="#4A90E2" stroke-width="1.5"/></svg>',
    data: {
      rows: 3,
      cols: 4,
    },
  },
  {
    label: '4×3',
    value: '4x3',
    preview:
      '<svg viewBox="0 0 60 40" width="60" height="40"><rect x="5" y="1" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="1" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="1" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="10" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="10" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="10" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="19" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="19" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="19" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="5" y="28" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="20" y="28" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/><rect x="35" y="28" width="15" height="9" fill="none" stroke="#4A90E2" stroke-width="1.5"/></svg>',
    data: {
      rows: 4,
      cols: 3,
    },
  },
  {
    label: '5×5',
    value: '5x5',
    preview:
      '<svg viewBox="0 0 60 40" width="60" height="40"><rect x="2" y="1" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="12" y="1" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="22" y="1" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="32" y="1" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="42" y="1" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="2" y="8" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="12" y="8" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="22" y="8" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="32" y="8" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="42" y="8" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="2" y="15" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="12" y="15" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="22" y="15" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="32" y="15" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="42" y="15" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="2" y="22" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="12" y="22" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="22" y="22" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="32" y="22" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="42" y="22" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="2" y="29" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="12" y="29" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="22" y="29" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="32" y="29" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/><rect x="42" y="29" width="10" height="7" fill="none" stroke="#4A90E2" stroke-width="1.2"/></svg>',
    data: {
      rows: 5,
      cols: 5,
    },
  },
];

const emit = defineEmits<{
  select: [option: TableOption];
}>();

const handleSelect = (option: TableOption) => {
  emit('select', option);
};
</script>

<style scoped>
.table-content {
  min-width: 340px;
  padding: 12px;
}

.content-title {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 12px;
}

.table-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.table-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.table-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.table-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}
</style>
