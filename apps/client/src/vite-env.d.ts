/// <reference types="vite/client" />

// unplugin-icons 类型声明
declare module '~icons/*' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
