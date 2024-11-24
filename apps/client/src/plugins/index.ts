import { Plugin } from 'vue';
import { usePrimeVue } from './primevue';

export const usePlugins: Plugin<void> = (app) => {
  app.use(usePrimeVue);
};
