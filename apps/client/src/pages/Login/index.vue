<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/auth';
import { useUserStore } from '@/models/user';
import { notify } from '@/plugins';

import { InputText, Password, Button } from 'primevue';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    notify({ severity: 'warn', summary: '警告', detail: '请输入用户名和密码', life: 3000 });
    return;
  }

  loading.value = true;
  try {
    const res = await authApi.login({
      username: username.value,
      password: password.value,
    });

    userStore.login(res.accessToken, res.user!);
    notify({ severity: 'success', summary: '成功', detail: '登录成功', life: 3000 });
    router.push('/home');
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '登录失败', life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center text-2xl font-bold">登录</h1>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium">用户名</label>
          <InputText v-model="username" placeholder="请输入用户名" class="w-full" @keydown.enter="handleLogin" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">密码</label>
          <Password
            v-model="password"
            placeholder="请输入密码"
            class="w-full"
            :feedback="false"
            toggleMask
            @keydown.enter="handleLogin"
          />
        </div>

        <Button label="登录" class="w-full" :loading="loading" @click="handleLogin" />
      </div>
    </div>
  </div>
</template>
