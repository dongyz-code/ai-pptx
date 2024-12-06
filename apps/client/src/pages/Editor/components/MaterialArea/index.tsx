import { defineComponent } from 'vue';
import { Button } from 'primevue';

const MaterialArea = defineComponent({
  name: 'MaterialArea',
  setup() {
    const onAddText = () => {
      console.log('添加文字');
    };

    return () => (
      <div>
        <Button label="添加文字" onClick={onAddText} />
      </div>
    );
  },
});

export default MaterialArea;
