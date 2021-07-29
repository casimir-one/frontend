<template>
  <layout-renderer
    :value="team"
    :schema="internalSchema"
    :schema-data="schemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/platform-fns';

  export default {
    name: 'TeamDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('team')
    ],

    computed: {
      schemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.team),
            {
              scopeName: 'team',
              scopeId: this.team.entityId
            }
          )
        };
      }
    }
  };
</script>
