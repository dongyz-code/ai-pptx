import { createApp } from 'vue';
import App from './App.tsx';
import { usePlugins } from './plugins';
import './styles/index.css';

createApp(App).use(usePlugins).mount('#app');
