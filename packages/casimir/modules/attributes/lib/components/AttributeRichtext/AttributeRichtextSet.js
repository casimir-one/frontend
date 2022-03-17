import { VexRichedit } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing richtext attribute
 */
export const AttributeRichtextSet = defineComponent({
  name: 'AttributeTextSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing richtext attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexRichedit
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
});
