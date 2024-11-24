import { defineComponent } from 'vue';
import { Button } from 'primevue';

const Home = defineComponent({
  name: 'Home',
  setup() {
    return () => <Button>Home</Button>;
  },
});

export default Home;
