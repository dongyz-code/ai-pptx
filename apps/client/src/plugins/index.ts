import { Plugin } from 'vue';
import { usePrimeVue } from './primevue';
import { usePinia } from './pinia';
import { router } from '@/router';
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
};
