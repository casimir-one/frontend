<template>
  <layout-renderer
    :value="project"
    :schema="internalSchema"
    :schema-data="internalSchemaData"
  />
</template>

<script>
  import { attributedDetailsFactory, LayoutRenderer } from '@deip/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@deip/attributes-module';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'ProjectDetails',

    components: {
      LayoutRenderer
    },

    mixins: [
      attributedDetailsFactory('project')
    ],

    computed: {
      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.project),
            {
              scopeName: 'project',
              scopeId: this.project._id
            }
          ),
          ...this.schemaData
        };
      }
    }
  });
</script>
