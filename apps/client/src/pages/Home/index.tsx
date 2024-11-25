import { defineComponent } from 'vue';
import { Button } from 'primevue';

const Home = defineComponent({
  name: 'Home',
  setup() {
    return () => (
      <div class="bg-primary m-4">
        <Button class="bg-red-100" onClick={() => alert('Home')}>
          Home
        </Button>
      </div>
    );
  },
});

export default Home;
