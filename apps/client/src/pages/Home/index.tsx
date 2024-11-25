import { defineComponent, ref } from 'vue';
import { Button, Dialog } from 'primevue';

const Home = defineComponent({
  name: 'Home',
  setup() {
    const open = ref(false);
    return () => (
      <div class="flex w-full flex-col items-center justify-center">
        <div class="m-4">
          <Button onClick={() => (open.value = true)}>Open</Button>
        </div>

        <div contenteditable class="h-36 w-36 border border-gray-300 p-4">
          afie
        </div>

        <Dialog v-model:visible={open.value}>
          <div>Hello</div>
        </Dialog>
      </div>
    );
  },
});

export default Home;
