import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin, AttributeOptionsReadMixin } from '../../mixins';

export const AttributeCheckboxRead = defineComponent({
  name: 'AttributeCheckboxRead',

  mixins: [
    AttributeReadMixin,
    AttributeOptionsReadMixin
  ],

  methods: {
    genSingleAttribute() {
      return (
        <div>{this.attributeInfo.title}</div>
      );
    },

    genMultipleAttribute() {
      return (
        <div>{this.optionsValueTitles.join(', ')}</div>
      );
    },

    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
});
