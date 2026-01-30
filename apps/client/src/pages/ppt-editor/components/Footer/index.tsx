import { defineComponent, ref } from 'vue';
import { Button, Slider } from 'primevue';
import { useSlides, useEditor } from '../../models';

const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const { state } = useSlides();
    const { editorState } = useEditor();

    return () => (
      <div class="flex justify-between p-2">
        <div class="left">
          <Button
            size="small"
            icon="pi pi-file-edit"
            label="备注"
            variant="text"
            severity="contrast"
          />
          <Button
            size="small"
            icon="pi pi-clock"
            label="计时器"
            variant="text"
            severity="contrast"
          />
        </div>

        <div class="right flex items-center gap-2">
          <Button
            size="small"
            label={`页数 ${state.sliderIndex + 1}/${state.slides.length}`}
            variant="text"
            severity="contrast"
          />

          <Slider v-model={editorState.viewportScale} class="w-56" min={0} max={2} step={0.01} />
          <Button
            size="small"
            label={`${(editorState.viewportScale * 100).toFixed(0)}%`}
            variant="text"
            severity="contrast"
          />

          <Button size="small" icon="pi pi-expand" variant="text" severity="contrast" />
        </div>
      </div>
    );
  },
});

export default Footer;
