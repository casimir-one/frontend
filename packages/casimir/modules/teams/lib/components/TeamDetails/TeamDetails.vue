<template>
  <layout-renderer
    :value="team"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/attributes-module';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'TeamDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('team')
    ],

    computed: {
      /**
       * Get computed schema data
      */
      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.team),
            {
              scopeName: 'team',
              scopeId: this.team._id
            }
          ),
          ...this.schemaData
        };
      }
    }
  });
</script>
