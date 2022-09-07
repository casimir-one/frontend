import {
  VSwitch
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VeStack } from '@casimir.one/vue-elements';
import { defineComponent } from '@casimir.one/platform-util';
import { AttributeMultipleModelMixin, AttributeSetMixin } from '../../mixins';

/**
 * Component for changing switch attribute
 */
export default defineComponent({
  name: 'AttributeSwitchSet',

  mixins: [AttributeSetMixin, AttributeMultipleModelMixin],

  methods: {
    /**
     * Generate single changing switch attribute
     *
     * @param {Array} errors
     */
    genSingleAttribute(errors) {
      return (
        <VSwitch
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    },
    /**
     * Generate changing switch attribute with multiple option values
     *
     * @param {Array} errors
     */
    genMultipleAttribute(errors) {
      const items = this.attributeInfo.valueOptions
        .map((v) => (
          <div>
            <VSwitch
              vModel={this.internalValue}
              value={v.value}
              label={v.title}
              class="ma-0 pa-0"
              hide-details
            />
          </div>
        ));
      return (
        <VeStack gap={16}>
          <div class="text-subtitle-1">{this.attributeInfo.title}</div>
          {items}
          {this.genErrors(errors)}
        </VeStack>
      );
    },
    /**
     * Generate changing switch attribute depending on options count
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute(errors)
        : this.genSingleAttribute(errors);
    }
  }
});
