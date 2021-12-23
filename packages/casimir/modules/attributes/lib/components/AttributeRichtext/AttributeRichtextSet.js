import { VexRichedit } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeRichtextSet = {
  name: 'AttributeTextSet',

  mixins: [AttributeSetMixin],

  methods: {
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
};
