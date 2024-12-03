import { defineComponent } from 'vue';

const Sidebar = defineComponent({
  name: 'Sidebar',
  setup() {
    return () => <div class="h-full">Sidebar</div>;
  },
});

export default Sidebar;
