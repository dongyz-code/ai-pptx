import { defineComponent, Transition } from 'vue';
import { RouterView } from 'vue-router';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  setup() {
    return () => (
      <div>
        <RouterView>
          {({ Component }: any) => (
            <Transition name="fade">
              <Component />
            </Transition>
          )}
        </RouterView>
      </div>
    );
  },
});

export default BasicLayout;
