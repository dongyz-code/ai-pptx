import { defineComponent, Transition } from 'vue';
import { RouterView } from 'vue-router';
import VHeader from './components/Header';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  setup() {
    return () => (
      <div>
        <VHeader />
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
