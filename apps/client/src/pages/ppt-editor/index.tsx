import { defineComponent } from 'vue';

import { useGlobalHotkey } from './hooks';

import VHeader from './components/Header';
import MaterialArea from './components/Sidebar/index.vue';
import EditorArea from './components/Canvas/index.vue';
import Sliders from './components/Slides';
import Footer from './components/Footer';

const Editor = defineComponent({
  name: 'ppt-editor',
  setup() {
    useGlobalHotkey();

    return () => (
      <div>
        <VHeader />
        <div class="flex h-(--body-height) bg-slate-100">
          <MaterialArea class="shrink-0" />
          <div class="flex w-[calc(100%-var(--sidebar-width))] shrink grow flex-col">
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
