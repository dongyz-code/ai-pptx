import { defineComponent } from 'vue';

import VHeader from './components/Header';
import MeterilArea from './components/MeterilArea';
import EditorArea from './components/EditorArea';
import Sliders from './components/Slides';

const Editor = defineComponent({
  name: 'Editor',
  setup() {
    return () => (
      <div>
        <VHeader />
        <div class="flex h-[var(--body-height)]">
          <div class="w-[var(--sidebar-width)] flex-shrink-0">
            <MeterilArea />
          </div>
          <div class="flex w-[calc(100%-var(--sidebar-width))] flex-shrink flex-grow flex-col bg-slate-100">
            <EditorArea class="flex-1" />
            <Sliders />
          </div>
        </div>
      </div>
    );
  },
});

export default Editor;
