import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only date time attribute
 */
export default defineComponent({
  name: 'AttributeDateTimeRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate date time attribute for read only
     */
    genAttribute() {
      return (
        <div>{this.internalValue.split('T').join(' ')}</div>
      );
    }
  }
});
