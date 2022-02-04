import {
  VCheckbox
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VeStack } from '@deip/vue-elements';
import { defineComponent } from '@deip/platform-util';
import { AttributeMultipleModelMixin, AttributeSetMixin } from '../../mixins';

export const AttributeCheckboxSet = defineComponent({
  name: 'AttributeCheckboxSet',

  mixins: [AttributeSetMixin, AttributeMultipleModelMixin],

  methods: {
    genSingleAttribute(errors) {
      return (
        <VCheckbox
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    },
    genMultipleAttribute(errors) {
      const items = this.attributeInfo.valueOptions
        .map((v) => (
          <div>
            <VCheckbox
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

    genAttribute(errors) {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute(errors)
        : this.genSingleAttribute(errors);
    }
  }
});
