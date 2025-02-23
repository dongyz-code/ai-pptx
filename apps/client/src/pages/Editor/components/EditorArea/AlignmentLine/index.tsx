import { defineComponent } from 'vue';

const AlignmentLine = defineComponent({
  name: 'AlignmentLine',
  props: {
    x1: { type: Number, required: true },
    y1: { type: Number, required: true },
    x2: { type: Number, required: true },
    y2: { type: Number, required: true },
    color: { type: String, default: 'black' },
    width: { type: Number, default: 1 },
  },
  setup(props) {
    return () => {
      const { x1, y1, x2, y2, color, width } = props;
      return <div></div>;
    };
  },
});

export default AlignmentLine;
