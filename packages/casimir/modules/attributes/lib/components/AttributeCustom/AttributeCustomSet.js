import {
  VBtn,
  VRow,
  VCol,
  VIcon
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { VlsParser } from '@deip/vue-layout-schema';
import { VeStack } from '@deip/vue-elements';
import { AttributeSetMixin, AttributeMultipleModelMixin, AttributeSchemaMixin } from '../../mixins';
import {
  schemaLayoutComponents,
  schemaFormComponents
} from '../../composables/schemaPartials';

export const AttributeCustomSet = defineComponent({
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

    genAttribute(errors) {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute(errors)
        : this.genSingleAttribute(errors);
    }
  }
});
