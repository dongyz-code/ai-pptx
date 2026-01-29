<template>
  <div class="image-content">
    <div class="content-title">添加图片</div>
    <div class="image-options">
      <div class="image-option" @click="handleUpload">
        <div class="option-icon">
          <VIcon icon="mdi:upload" />
        </div>
        <div class="option-text">
          <div class="option-label">上传图片</div>
          <div class="option-desc">从本地上传图片</div>
        </div>
      </div>
      <div class="image-option" @click="handleFromUrl">
        <div class="option-icon">
          <VIcon icon="mdi:link-variant" />
        </div>
        <div class="option-text">
          <div class="option-label">网络图片</div>
          <div class="option-desc">输入图片链接</div>
        </div>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VIcon } from '@/components/ui';

interface ImageOption {
  type: 'upload' | 'url';
  src?: string;
  file?: File;
}

const emit = defineEmits<{
  select: [option: ImageOption];
}>();

const fileInput = ref<HTMLInputElement>();

const handleUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      emit('select', {
        type: 'upload',
        src: e.target?.result as string,
        file,
      });
    };
    reader.readAsDataURL(file);
  }
};

const handleFromUrl = () => {
  const url = prompt('请输入图片链接：');
  if (url && url.trim()) {
    emit('select', {
      type: 'url',
      src: url.trim(),
    });
  }
};
</script>

<style scoped>
.image-content {
  min-width: 280px;
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

.image-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.image-option:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
}

.option-icon {
  font-size: 32px;
  color: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-text {
  flex: 1;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #999;
}
</style>
