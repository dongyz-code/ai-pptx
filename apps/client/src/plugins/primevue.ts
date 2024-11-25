import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import type { Plugin } from 'vue';

export const usePrimeVue: Plugin<void> = (app) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  });
};
