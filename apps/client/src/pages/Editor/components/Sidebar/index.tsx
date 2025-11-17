import { defineComponent } from 'vue';
import { Button } from 'primevue';
import { useAction } from './useAction';

const MaterialArea = defineComponent({
  name: 'MaterialArea',
  setup() {
    const { onAddText } = useAction();

    return () => (
      <div>
        <Button label="添加文字" onClick={() => onAddText} />
      </div>
    );
  },
});

export default MaterialArea;
