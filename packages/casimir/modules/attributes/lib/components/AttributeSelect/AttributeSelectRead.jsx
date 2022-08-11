import { defineComponent } from '@casimir/platform-util';
import { AttributeOptionsReadMixin, AttributeReadMixin } from '../../mixins';

/**
 * Component for read only select attribute
 */
export default defineComponent({
  name: 'AttributeSelectRead',

  mixins: [
    AttributeReadMixin,
    AttributeOptionsReadMixin
  ],

  methods: {
    /**
     * Generate select attribute with list options for read only
     */
    genAttribute() {
      return (
        <div>{this.optionsValueTitles.join(', ')}</div>
      );
    }
  }
});
