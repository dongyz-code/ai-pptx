import { defineComponent } from 'vue';
import { router } from '@/router';
import { useEditor } from '../../models/editor';

const VHeader = defineComponent({
  name: 'VHeader',
  setup() {
    const goHome = () => {
      router.push('/home');
    };

    const { togglePropertyPanel, editorState } = useEditor();

    return () => (
      <header class="h-[var(--header-height)] bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] px-5 py-2">
        <div class="flex h-full items-center justify-between">
          <div class="flex cursor-pointer items-center" onClick={goHome}>
            <img src="/logo.png" alt="AI PPTX" class="h-6" />
          </div>

          <div class="flex items-center gap-2">
            <button
              title="属性编辑器"
              onClick={togglePropertyPanel}
              class={[
                'flex h-8 w-8 items-center justify-center rounded-lg border transition-all',
                editorState.showPropertyPanel
                  ? 'border-white/40 bg-white/20 text-white'
                  : 'border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white',
              ]}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </button>

            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              title="用户"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  },
});

export default VHeader;
