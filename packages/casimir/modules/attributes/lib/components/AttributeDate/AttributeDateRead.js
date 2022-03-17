import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only date attribute
 */
export const AttributeDateRead = defineComponent({
  name: 'AttributeDateRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate date attribute for read only
     */
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});
