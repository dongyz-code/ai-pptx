import { Plugin } from 'vue';
import { usePrimeVue } from './primevue';
import { usePinia } from './pinia';
import { router } from '@/router';
import ToastService from 'primevue/toastservice';

/**
 * 统一导出
 */
export { request } from './axios';
export { notify } from './notify';

/**
 * Vue 插件
 */
export const usePlugins: Plugin<void> = (app) => {
  app.use(usePrimeVue);
  app.use(usePinia);
  app.use(router);

  // 注册 Toast 服务
  app.use(ToastService);
};
