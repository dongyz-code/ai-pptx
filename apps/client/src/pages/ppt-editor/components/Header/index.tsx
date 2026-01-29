import { defineComponent } from 'vue';
import { Button } from 'primevue';
import { router } from '@/router';

const VHeader = defineComponent({
  name: 'VHeader',
  setup() {
    const goHome = () => {
      router.push('/home');
    };
    return () => (
      <header class="h-[var(--header-height)] bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] px-5 py-2">
        <div class="flex h-full items-center justify-between">
          <div class="flex cursor-pointer items-center" onClick={goHome}>
            <img src="/logo.png" alt="AI PPTX" class="h-6" />
          </div>

          <div class="flex items-center">
            <Button icon="pi pi-user" text />
          </div>
        </div>
      </header>
    );
  },
});

export default VHeader;
