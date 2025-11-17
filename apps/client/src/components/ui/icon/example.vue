<script setup lang="ts">
import Icon from './index.vue';
</script>

<template>
  <div class="icon-examples">
    <h2>Icon 组件示例</h2>

    <!-- 基础用法 -->
    <section>
      <h3>基础用法</h3>
      <div class="demo-row">
        <Icon icon="tabler:error-404" />
        <Icon icon="weui:arrow-filled" />
        <Icon icon="weui:arrow-outlined" />
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section>
      <h3>不同尺寸</h3>
      <div class="demo-row">
        <Icon icon="tabler:error-404" size="16px" />
        <Icon icon="tabler:error-404" size="24px" />
        <Icon icon="tabler:error-404" size="32px" />
        <Icon icon="tabler:error-404" :size="48" />
      </div>
    </section>

    <!-- 不同颜色 -->
    <section>
      <h3>不同颜色</h3>
      <div class="demo-row">
        <Icon icon="weui:arrow-filled" color="red" />
        <Icon icon="weui:arrow-filled" color="blue" />
        <Icon icon="weui:arrow-filled" color="green" />
        <Icon icon="weui:arrow-filled" color="#ff6b6b" />
      </div>
    </section>

    <!-- 继承父元素样式 -->
    <section>
      <h3>继承父元素样式</h3>
      <div class="demo-row">
        <span style="font-size: 24px; color: purple">
          <Icon icon="weui:arrow-outlined" />
          继承父元素的颜色和大小
        </span>
      </div>
    </section>

    <!-- 在按钮中使用 -->
    <section>
      <h3>在按钮中使用</h3>
      <div class="demo-row">
        <button class="demo-button">
          <Icon icon="weui:arrow-filled" />
          <span>带图标的按钮</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icon-examples {
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

h2 {
  margin-bottom: 2rem;
  color: #333;
}

section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  color: #666;
  font-size: 1.1rem;
}

.demo-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.demo-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.demo-button:hover {
  background: #0056b3;
}
</style>
