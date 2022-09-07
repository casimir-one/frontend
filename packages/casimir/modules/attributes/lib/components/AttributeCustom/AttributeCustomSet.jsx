import {
  VBtn,
  VRow,
  VCol,
  VIcon
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@casimir.one/platform-util';
import { VlsParser } from '@casimir.one/vue-layout-schema';
import { VeStack } from '@casimir.one/vue-elements';
import { AttributeSetMixin, AttributeMultipleModelMixin, AttributeSchemaMixin } from '../../mixins';
import {
  schemaLayoutComponents,
  schemaFormComponents
} from '../../composables/schemaPartials';

/**
 * Component for custom editable attribute
 */
export default defineComponent({
  name: 'AttributeCustomSet',

  mixins: [
    AttributeSetMixin,
    AttributeMultipleModelMixin,
    AttributeSchemaMixin
  ],

  mounted() {
    this.addInitialValueItem({});
  },

  methods: {
    /**
     * Generate single changing custom attribute
     *
     * @param {Array} errors
     */
    genSingleAttribute(errors) {
      return (
        <VeStack gap={4}>
          <VlsParser
            schema={this.getAttributeSchema('set')}
            schemaData={this.getAttributeSchemaData(this.internalValue)}
            components={{ ...schemaLayoutComponents, ...schemaFormComponents }}
            vModel={this.internalValue}
          />
          {this.genErrors(errors)}
        </VeStack>
      );
    },
    /**
     * Generate changing custom attribute with multiple values
     *
     * @param {Array} errors
     */
    genMultipleAttribute(errors) {
      const items = () => this.internalValue
        .map((_, index) => {
          const delBtn = () => (
            <VBtn
              icon small class="my-1"
              disabled={index === 0}
              onClick={() => { this.removeValueItem(index); }}
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          );

          return (
            <VRow>
              <VCol>
                <VlsParser
                  schema={this.getAttributeSchema('set')}
                  schemaData={this.getAttributeSchemaData(this.internalValue[index])}
                  components={{ ...schemaLayoutComponents, ...schemaFormComponents }}
                  vModel={this.internalValue[index]}
                />
              </VCol>
              <VCol cols="auto">{delBtn()}</VCol>
            </VRow>
          );
        });

      const addBtn = () => (
        <VBtn
          outlined
          small
          color="primary"
          onClick={() => { this.addValueItem({}); }}
        >
          Add
        </VBtn>
      );
      return (
        <VeStack gap={4}>
          {items()}
          {this.genErrors(errors)}
          <div>{addBtn()}</div>
        </VeStack>
      );
    },
    /**
     * Generate changing custom attribute
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
