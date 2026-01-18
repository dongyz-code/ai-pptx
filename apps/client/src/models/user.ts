import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { LoginUserInfo } from '@pkg/types';

const TOKEN_KEY = 'access_token';
const USER_INFO_KEY = 'user_info';

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '');
  const userInfo = ref<LoginUserInfo | null>(
    localStorage.getItem(USER_INFO_KEY) ? JSON.parse(localStorage.getItem(USER_INFO_KEY)!) : null
  );

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value);

  /**
   * 登录 - 保存 token 和用户信息
   */
  function login(accessToken: string, user: LoginUserInfo) {
    token.value = accessToken;
    userInfo.value = user;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }

  /**
   * 登出 - 清除所有用户数据
   */
  function logout() {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  /**
   * 更新用户信息
   */
  function updateUserInfo(info: LoginUserInfo) {
    userInfo.value = info;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
  }

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,

    // 方法
    login,
    logout,
    updateUserInfo,
  };
});
