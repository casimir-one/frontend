import { VexFileInputExtended } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing file attribute
 */
export default defineComponent({
  name: 'AttributeFileSet',

  mixins: [AttributeSetMixin],

  data() {
    return {
      lazyValue: undefined
    };
  },

  methods: {
    /**
     * Generate changing file attribute
     *
     * @param {Array} errors
     */
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
