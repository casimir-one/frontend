import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeNumberRead = defineComponent({
  name: 'AttributeNumberRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});
