import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only number attribute
 */
export const AttributeNumberRead = defineComponent({
  name: 'AttributeNumberRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate number attribute for read only
     */
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});
