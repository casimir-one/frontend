import { defineComponent } from '@casimir.one/platform-util';
import { AttributeReadMixin, AttributeOptionsReadMixin } from '../../mixins';

/**
 * Component for attribute checkbox read only
 */
export default defineComponent({
  name: 'AttributeCheckboxRead',

  mixins: [
    AttributeReadMixin,
    AttributeOptionsReadMixin
  ],

  methods: {
    /**
     * Generate checkbox with one option for read only
     */
    genSingleAttribute() {
      return (
        <div>{this.attributeInfo.title}</div>
      );
    },

    /**
     * Generate checkbox with multiple options for read only
     */
    genMultipleAttribute() {
      return (
        <div>{this.optionsValueTitles.join(', ')}</div>
      );
    },

    /**
     * Generate checkbox depending on options count for read only
     */
    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
});
