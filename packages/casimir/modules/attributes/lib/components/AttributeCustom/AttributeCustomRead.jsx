import { VlsParser } from '@deip/vue-layout-schema';
import { VeStack } from '@deip/vue-elements';
import { defineComponent } from '@deip/platform-util';
import { schemaLayoutComponents } from '../../composables/schemaPartials';

import { AttributeReadMixin, AttributeSchemaMixin } from '../../mixins';

/**
 * Component for custom read only attribute
 */
export default defineComponent({
  name: 'AttributeCustomRead',

  mixins: [
    AttributeReadMixin,
    AttributeSchemaMixin
  ],

  methods: {
    /**
     * Generate single custom attribute for read only
     *
     * @param {*} value
     */
    genSingleAttribute(value = this.internalValue) {
      return (
        <VlsParser
          schema={this.getAttributeSchema('read')}
          schemaData={this.getAttributeSchemaData(value)}
          components={schemaLayoutComponents}
        />
      );
    },
    /**
     * Generate custom attribute with multiple values for read only
     */
    genMultipleAttribute() {
      const items = this.internalValue
        .map((value) => this.genSingleAttribute(value));

      return (
        <VeStack gap={24}>
          {items}
        </VeStack>
      );
    },
    /**
     * Generate custom attribute for read only
     */
    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
});
