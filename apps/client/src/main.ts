import { createApp } from 'vue';
import App from './App.tsx';
import { usePlugins } from './plugins';
import { router } from './router';
import './styles/index.css';

createApp(App).use(router).use(usePlugins).mount('#app');
