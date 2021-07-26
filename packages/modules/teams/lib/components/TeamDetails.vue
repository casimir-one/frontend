<template>
  <schema-renderer
    :value="team"
    :schema="internalSchema"
    :components="internalComponents"
    :schema-data="schemaData"
  />
</template>

<script>
  import { SchemaRenderer } from '@deip/schema-renderer';
  import { attributedDetailsFactory } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/platform-fns';

  export default {
    name: 'TeamDetails',

    components: {
      SchemaRenderer
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
