<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authApi } from '@/api/auth';
import { useUserStore } from '@/models/user';
import { notify } from '@/plugins';

import { InputText, Password, Button } from 'primevue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const loginForm = ref({
  username: '',
  password: '',
});

const redirect = computed(() => {
  const redirect = route.query.redirect as string;
  return redirect ? decodeURIComponent(redirect) : '/home';
});

const handleLogin = async () => {
  const { username, password } = loginForm.value;
  if (!username || !password) {
    return;
  }

  loading.value = true;
  try {
    const res = await authApi.login({
      username,
      password,
    });

    userStore.login(res.accessToken, res.user!);
    notify({ severity: 'success', summary: '成功', detail: '登录成功', life: 3000 });
    router.push('/home');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center text-2xl font-bold">登录</h1>

      <div class="flex flex-col gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">用户名</label>
          <InputText fluid v-model="loginForm.username" placeholder="请输入用户名" @keydown.enter="handleLogin" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">密码</label>
          <Password
            v-model="loginForm.password"
            placeholder="请输入密码"
            :feedback="false"
            fluid
            toggleMask
            @keydown.enter="handleLogin"
          />
        </div>

        <Button label="登录" class="w-full" :loading="loading" @click="handleLogin" />
      </div>
    </div>
  </div>
</template>
