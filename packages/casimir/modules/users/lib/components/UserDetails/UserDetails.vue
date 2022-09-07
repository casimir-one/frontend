<template>
  <layout-renderer
    :value="user"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@casimir.one/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@casimir.one/attributes-module';
  import { defineComponent } from '@casimir.one/platform-util';

  export default defineComponent({
    name: 'UserDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('user')
    ],

    computed: {
      /**
       * Get computed schema data
       */
      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.user),
            {
              scopeName: 'user',
              scopeId: this.user._id
            }
          ),
          ...this.schemaData
        };
      }
    }
  });
</script>
