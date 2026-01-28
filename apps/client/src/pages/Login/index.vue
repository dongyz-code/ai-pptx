<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { Button } from 'primevue';
import { authApi } from '@/api/auth';
import { useUserStore } from '@/models/user';
import { notify } from '@/plugins';
import { ProForm } from '@/components/ui/pro-form';
import type { ProFormFieldSchema } from '@/components/ui/pro-form';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);

const redirect = computed(() => {
  const redirect = route.query.redirect as string;
  return redirect ? decodeURIComponent(redirect) : '/home';
});

const formSchema: ProFormFieldSchema[] = [
  {
    key: 'username',
    label: '用户名',
    valueType: 'text',
    placeholder: '请输入用户名',
    value: '',
    schema: z.string().min(1, '请输入用户名'),
  },
  {
    key: 'password',
    label: '密码',
    valueType: 'password',
    placeholder: '请输入密码',
    value: '',
    schema: z.string().min(1, '请输入密码'),
  },
];

const handleLogin = async (values: Record<string, any>) => {
  loading.value = true;
  try {
    const res = await authApi.login({
      username: values.username,
      password: values.password,
    });

    userStore.login(res.accessToken, res.user!);
    notify({ severity: 'success', summary: '成功', detail: '登录成功' });
    router.push(redirect.value);
  } catch (e) {
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center text-2xl font-bold">登录</h1>

      <ProForm :schema="formSchema" @submit="handleLogin">
        <template #actions="{ submit }">
          <Button label="登录" class="w-full" :loading="loading" @click="submit" />
        </template>
      </ProForm>
    </div>
  </div>
</template>
