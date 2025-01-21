import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      // '/api': 'http://localhost:3000'
    },
  },
  build: {
    target: 'es2020',
  },
  plugins: [vueJsx(), vue()],
});
