import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeLocationRead = defineComponent({
  name: 'AttributeLocationRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});
