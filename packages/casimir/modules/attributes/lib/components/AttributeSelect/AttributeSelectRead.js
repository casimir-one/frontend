import { defineComponent } from '@deip/platform-util';
import { AttributeOptionsReadMixin, AttributeReadMixin } from '../../mixins';

export const AttributeSelectRead = defineComponent({
  name: 'AttributeSelectRead',

  mixins: [
    AttributeReadMixin,
    AttributeOptionsReadMixin
  ],

  methods: {
    genAttribute() {
      return (
        <div>{this.optionsValueTitles.join(', ')}</div>
      );
    }
  }
});
