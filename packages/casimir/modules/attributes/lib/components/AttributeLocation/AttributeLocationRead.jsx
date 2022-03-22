import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only location attribute
 */
export default defineComponent({
  name: 'AttributeLocationRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate location attribute for read only
     */
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});
