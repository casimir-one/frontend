import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin, AttributeOptionsReadMixin } from '../../mixins';

export const AttributeSwitchRead = defineComponent({
  name: 'AttributeSwitchRead',

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
