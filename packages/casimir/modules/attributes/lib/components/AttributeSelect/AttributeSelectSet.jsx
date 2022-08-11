import {
  VSelect
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@casimir/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
  * Component for changing select attribute
  */
export default defineComponent({
  name: 'AttributeSelectSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing select attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VSelect
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          items={this.attributeInfo.valueOptions}
          item-text="title"
          item-value="value"
          multiple={!!this.attributeInfo.isMultiple}
          errorMessages={errors}
        />
      );
    }
  }
});
