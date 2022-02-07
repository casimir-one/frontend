<template>
  <layout-renderer
    :value="user"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/attributes-module';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'UserDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('user')
    ],

    computed: {
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
