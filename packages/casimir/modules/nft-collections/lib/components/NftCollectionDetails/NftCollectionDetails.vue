<template>
  <layout-renderer
    :value="nftCollection"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@casimir/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@casimir/attributes-module';
  import { defineComponent } from '@casimir/platform-util';

  export default defineComponent({
    name: 'NftCollectionDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('nftCollection')
    ],

    computed: {
      /**
       * Get computed schema data
       */
      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.nftCollection),
            {
              scopeName: 'nftCollection',
              scopeId: this.nftCollection._id
            }
          ),
          ...this.schemaData
        };
      }
    }
  });
</script>
