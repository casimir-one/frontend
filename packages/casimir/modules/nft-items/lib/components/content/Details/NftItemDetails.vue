<template>
  <vex-block v-if="nftItem">
    <layout-renderer
      :value="nftItem"
      :schema="internalSchema"
      :schema-data="internalSchemaData"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';
  import { AttributeScope } from '@casimir/platform-core';
  import { VexBlock } from '@casimir/vuetify-extended';
  import { attributedDetailsFactory, LayoutRenderer } from '@casimir/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@casimir/attributes-module';

  /**
   * Component for NFT item details
   */
  export default defineComponent({
    name: 'NftItemDetails',

    components: {
      VexBlock,
      LayoutRenderer
    },
    mixins: [
      attributedDetailsFactory('nftItem')
    ],

    computed: {

      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.nftItem),
            {
              scopeName: AttributeScope.NFT_ITEM,
              scopeId: this.nftItem._id
            }
          ),
          ...this.schemaData
        };
      }
    }
  });
</script>
