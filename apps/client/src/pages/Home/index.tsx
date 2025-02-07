import { defineComponent, ref } from 'vue';
import { Button, Dialog } from 'primevue';
import { routerPush } from '@/utils/route';

const Home = defineComponent({
  name: 'Home',
  setup() {
    const open = ref(false);

    const goEditor = () => {
      routerPush({ name: 'Editor' });
    };

    return () => (
      <div class="flex w-full flex-col items-center justify-center">
        <div class="flex w-full p-2">
          <Button onClick={goEditor}>Go Editor</Button>
        </div>
        <div class="m-4">
          <Button onClick={() => (open.value = true)}>Open</Button>
        </div>

        <div contenteditable class="h-36 w-36 border border-gray-300 p-4">
          afie
        </div>
        <svg viewBox="0 0 240 40" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="30" class="small" style="cursor: text" text-anchor="start">
            你<tspan>不是</tspan>
            香蕉！
          </text>
        </svg>

        <Dialog v-model:visible={open.value}>
          <div>Hello</div>
        </Dialog>
      </div>
    );
  },
});

export default Home;
