<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">ProForm 完整示例</h1>

    <!-- 基础表单示例 -->
    <Card class="mb-6">
      <template #title>基础表单</template>
      <template #content>
        <ProForm
          ref="basicFormRef"
          :schema="basicFormSchema"
          v-model="basicFormData"
          @submit="handleBasicSubmit"
          @reset="handleBasicReset"
        />
      </template>
    </Card>

    <!-- 高级表单示例（带校验、Grid 布局） -->
    <Card class="mb-6">
      <template #title>高级表单（带校验 + Grid 布局）</template>
      <template #content>
        <ProForm
          ref="advancedFormRef"
          :schema="advancedFormSchema"
          v-model="advancedFormData"
          :grid="true"
          :grid-props="{ cols: 3, gutter: 16 }"
          @submit="handleAdvancedSubmit"
          @values-change="handleValuesChange"
        >
          <template #actions="{ submit, reset }">
            <Button type="button" label="提交" @click="submit" />
            <Button type="button" label="重置" severity="secondary" @click="reset" />
            <Button type="button" label="手动校验" severity="info" @click="handleManualValidate" />
          </template>
        </ProForm>
      </template>
    </Card>

    <!-- 动态 Options 示例 -->
    <Card class="mb-6">
      <template #title>动态 Options（异步加载）</template>
      <template #content>
        <ProForm
          :schema="dynamicFormSchema"
          v-model="dynamicFormData"
          @submit="handleDynamicSubmit"
        />
      </template>
    </Card>

    <!-- 表单数据展示 -->
    <Card>
      <template #title>表单数据</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold mb-2">基础表单数据：</h3>
            <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(basicFormData, null, 2) }}</pre>
          </div>
          <div>
            <h3 class="font-semibold mb-2">高级表单数据：</h3>
            <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(advancedFormData, null, 2) }}</pre>
          </div>
          <div>
            <h3 class="font-semibold mb-2">动态表单数据：</h3>
            <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(dynamicFormData, null, 2) }}</pre>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { z } from 'zod';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { ProForm } from '../index';
import type { ProFormFieldSchema, ProFormInstance } from '../types';

// ==================== 基础表单 ====================
const basicFormRef = ref<ProFormInstance>();
const basicFormData = ref({});

const basicFormSchema: ProFormFieldSchema[] = [
  {
    key: 'username',
    label: '用户名',
    valueType: 'text',
    placeholder: '请输入用户名',
    value: '',
  },
  {
    key: 'password',
    label: '密码',
    valueType: 'password',
    placeholder: '请输入密码',
  },
  {
    key: 'age',
    label: '年龄',
    valueType: 'number',
    placeholder: '请输入年龄',
    props: {
      min: 0,
      max: 150,
    },
  },
  {
    key: 'bio',
    label: '个人简介',
    valueType: 'textarea',
    placeholder: '请输入个人简介',
    props: {
      rows: 4,
    },
  },
  {
    key: 'isActive',
    label: '是否激活',
    valueType: 'switch',
    value: false,
  },
];

const handleBasicSubmit = (values: Record<string, any>) => {
  console.log('基础表单提交：', values);
  alert('基础表单提交成功！查看控制台');
};

const handleBasicReset = () => {
  console.log('基础表单重置');
};

// ==================== 高级表单（带校验） ====================
const advancedFormRef = ref<ProFormInstance>();
const advancedFormData = ref({});

const advancedFormSchema: ProFormFieldSchema[] = [
  {
    key: 'email',
    label: '邮箱',
    valueType: 'text',
    placeholder: '请输入邮箱',
    tooltip: '请输入有效的邮箱地址',
    schema: z.string().email('请输入有效的邮箱地址'),
    colProps: { md: 2 },
  },
  {
    key: 'phone',
    label: '手机号',
    valueType: 'text',
    placeholder: '请输入手机号',
    schema: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
    colProps: { md: 1 },
  },
  {
    key: 'gender',
    label: '性别',
    valueType: 'radio',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' },
    ],
    schema: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: '请选择性别' }),
    }),
    colProps: { md: 3 },
  },
  {
    key: 'hobbies',
    label: '兴趣爱好',
    valueType: 'checkboxGroup',
    options: [
      { label: '阅读', value: 'reading' },
      { label: '运动', value: 'sports' },
      { label: '音乐', value: 'music' },
      { label: '旅游', value: 'travel' },
    ],
    schema: z.array(z.string()).min(1, '请至少选择一项兴趣爱好'),
    colProps: { md: 3 },
  },
  {
    key: 'city',
    label: '城市',
    valueType: 'select',
    placeholder: '请选择城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
    schema: z.string().min(1, '请选择城市'),
    colProps: { md: 1 },
  },
  {
    key: 'skills',
    label: '技能',
    valueType: 'multiSelect',
    placeholder: '请选择技能',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'TypeScript', value: 'typescript' },
    ],
    schema: z.array(z.string()).min(1, '请至少选择一项技能'),
    colProps: { md: 2 },
  },
  {
    key: 'birthday',
    label: '生日',
    valueType: 'date',
    placeholder: '请选择生日',
    schema: z.date({ required_error: '请选择生日' }),
    colProps: { md: 1 },
  },
  {
    key: 'workPeriod',
    label: '工作时间段',
    valueType: 'dateRange',
    placeholder: '请选择工作时间段',
    colProps: { md: 2 },
  },
  {
    key: 'agreeTerms',
    label: '同意服务条款',
    valueType: 'checkbox',
    schema: z.boolean().refine((val) => val === true, {
      message: '请同意服务条款',
    }),
    colProps: { md: 3 },
  },
];

const handleAdvancedSubmit = async (values: Record<string, any>) => {
  console.log('高级表单提交：', values);
  alert('高级表单提交成功！查看控制台');
};

const handleValuesChange = (changedValues: Record<string, any>, allValues: Record<string, any>) => {
  console.log('字段变化：', changedValues);
  console.log('所有值：', allValues);
};

const handleManualValidate = async () => {
  if (advancedFormRef.value) {
    const result = await advancedFormRef.value.validate();
    if (result.valid) {
      alert('校验通过！');
    } else {
      alert('校验失败，请检查表单');
      console.log('校验错误：', result.errors);
    }
  }
};

// ==================== 动态 Options 示例 ====================
const dynamicFormData = ref({});

// 模拟异步加载 options
const fetchCities = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
      ]);
    }, 1000);
  });
};

// 使用 computed 的 options
const computedOptions = computed(() => [
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' },
]);

const dynamicFormSchema: ProFormFieldSchema[] = [
  {
    key: 'asyncCity',
    label: '城市（异步加载）',
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
    key: 'treeData',
    label: '树形选择',
    valueType: 'treeSelect',
    placeholder: '请选择',
    options: [
      {
        label: '前端',
        value: 'frontend',
        children: [
          { label: 'Vue', value: 'vue' },
          { label: 'React', value: 'react' },
        ],
      },
      {
        label: '后端',
        value: 'backend',
        children: [
          { label: 'Node.js', value: 'nodejs' },
          { label: 'Java', value: 'java' },
        ],
      },
    ],
  },
];

const handleDynamicSubmit = (values: Record<string, any>) => {
  console.log('动态表单提交：', values);
  alert('动态表单提交成功！查看控制台');
};
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
