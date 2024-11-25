import { Plugin } from 'vue';
import { usePrimeVue } from './primevue';
import { usePinia } from './pinia';
import { router } from '@/router';

export const usePlugins: Plugin<void> = (app) => {
  app.use(usePrimeVue);
  app.use(usePinia);
  app.use(router);
};
