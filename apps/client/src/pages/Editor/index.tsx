import { defineComponent } from 'vue';

import { useGlobalHotkey } from './hooks';

import VHeader from './components/Header';
import MaterialArea from './components/MaterialArea';
import EditorArea from './components/EditorArea';
import Sliders from './components/Slides';
import Footer from './components/Footer';

const Editor = defineComponent({
  name: 'Editor',
  setup() {
    useGlobalHotkey();

    return () => (
      <div>
        <VHeader />
        <div class="flex h-[var(--body-height)]">
          <div class="w-[var(--sidebar-width)] flex-shrink-0">
            <MaterialArea />
          </div>
          <div class="flex w-[calc(100%-var(--sidebar-width))] flex-shrink flex-grow flex-col bg-slate-100">
            <EditorArea class="flex-1" />
            <Sliders />
            <Footer />
          </div>
        </div>
      </div>
    );
  },
});

export default Editor;
