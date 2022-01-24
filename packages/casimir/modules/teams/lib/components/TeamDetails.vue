<template>
  <layout-renderer
    :value="team"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/platform-fns';
  import { SYSTEM_ROLE } from '@deip/constants';

  export default {
    name: 'TeamDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('team')
    ],

    computed: {
      internalSchemaData() {
        return {
          canEdit: this.$currentUser.hasRole(
            SYSTEM_ROLE.TEAM_ADMIN,
            { name: 'teamId', id: this.team._id }
          ),
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
  };
</script>
