import { VexFileInputExtended } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeFileSet = defineComponent({
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
});
