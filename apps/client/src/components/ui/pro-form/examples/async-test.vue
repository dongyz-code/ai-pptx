<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">异步 Options 测试</h1>

    <ProForm
      :schema="formSchema"
      v-model="formData"
      @submit="handleSubmit"
    />

    <div class="mt-4 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">表单数据：</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ProForm } from '../index';
import type { ProFormFieldSchema } from '../types';

const formData = ref({});

// 模拟异步加载 options
const fetchCities = async () => {
  console.log('开始加载城市数据...');
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      console.log('城市数据加载完成');
      resolve([
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
      ]);
    }, 2000); // 2秒延迟
  });
};

// 使用 computed 的 options
const computedOptions = computed(() => {
  console.log('computed options 被调用');
  return [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2' },
    { label: '选项 3', value: '3' },
  ];
});

// 使用 ref 的 options
const refOptions = ref([
  { label: 'Ref 选项 1', value: 'r1' },
  { label: 'Ref 选项 2', value: 'r2' },
]);

const formSchema: ProFormFieldSchema[] = [
  {
    key: 'asyncCity',
    label: '城市（异步加载，2秒延迟）',
    valueType: 'select',
    placeholder: '请选择城市',
    options: fetchCities,
  },
  {
    key: 'computedOption',
    label: '选项（Computed）',
    valueType: 'select',
    placeholder: '请选择选项',
    options: computedOptions,
  },
  {
    key: 'refOption',
    label: '选项（Ref）',
    valueType: 'select',
    placeholder: '请选择选项',
    options: refOptions,
  },
  {
    key: 'normalOption',
    label: '选项（普通数组）',
    valueType: 'select',
    placeholder: '请选择选项',
    options: [
      { label: '普通选项 1', value: 'n1' },
      { label: '普通选项 2', value: 'n2' },
    ],
  },
];

const handleSubmit = (values: Record<string, any>) => {
  console.log('提交数据：', values);
  alert('提交成功！查看控制台');
};
</script>
