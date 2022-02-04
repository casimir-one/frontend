import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeDateTimeRead = defineComponent({
  name: 'AttributeDateTimeRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue.split('T').join(' ')}</div>
      );
    }
  }
});
