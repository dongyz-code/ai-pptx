import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue';

import { setToastInstance } from './plugins/notify';

const App = defineComponent({
  name: 'App',
  setup() {
    const toast = useToast();
    setToastInstance(toast);

    return () => (
      <>
        <Toast />
        <RouterView />
      </>
    );
  },
});

export default App;
