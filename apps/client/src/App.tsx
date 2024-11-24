import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

const App = defineComponent({
  name: 'App',
  setup() {
    return () => <RouterView />;
  },
});

export default App;
