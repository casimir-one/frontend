import { VexFileInputExtended } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeFileSet = {
  name: 'AttributeFileSet',

  mixins: [AttributeSetMixin],

  data() {
    return {
      lazyValue: undefined
    };
  },

  methods: {
    genAttribute(errors) {
      return (
        <VexFileInputExtended
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          multiple={!!this.attributeInfo.isMultiple}
          errorMessages={errors}
        />
      );
    }
  }
};
