import { VlsParser } from '@deip/vue-layout-schema';
import { VeStack } from '@deip/vue-elements';
import { schemaLayoutComponents } from '../../composables/schemaPartials';

import { AttributeReadMixin, AttributeSchemaMixin } from '../../mixins';

export const AttributeCustomRead = {
  name: 'AttributeCustomRead',

  mixins: [
    AttributeReadMixin,
    AttributeSchemaMixin
  ],

  methods: {
    genSingleAttribute(value = this.internalValue) {
      return (
        <VlsParser
          schema={this.getAttributeSchema('read')}
          schemaData={this.getAttributeSchemaData(value)}
          components={schemaLayoutComponents}
        />
      );
    },

    genMultipleAttribute() {
      const items = this.internalValue
        .map((value) => this.genSingleAttribute(value));

      return (
        <VeStack gap={24}>
          {items}
        </VeStack>
      );
    },

    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
};
