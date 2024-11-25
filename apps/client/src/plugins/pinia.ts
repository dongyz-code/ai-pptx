import { createPinia } from 'pinia';
import type { Plugin } from 'vue';

export const usePinia: Plugin<void> = (app) => {
  app.use(createPinia());
};
