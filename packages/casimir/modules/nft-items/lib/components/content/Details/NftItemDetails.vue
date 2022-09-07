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
  import { defineComponent } from '@casimir.one/platform-util';
  import { AttributeScope } from '@casimir.one/platform-core';
  import { VexBlock } from '@casimir.one/vuetify-extended';
  import { attributedDetailsFactory, LayoutRenderer } from '@casimir.one/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@casimir.one/attributes-module';

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
