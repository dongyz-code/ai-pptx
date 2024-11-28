import { defineComponent } from 'vue';
import VHeader from './components/Header';

const Editor = defineComponent({
  name: 'Editor',
  setup() {
    return () => (
      <div>
        <VHeader />
      </div>
    );
  },
});

export default Editor;
