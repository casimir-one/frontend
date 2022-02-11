<template>
  <vex-section max-width="1200" class="mx-auto pa-0">
    <ve-stack :gap="32">
      <vex-section-title title="Attribute settings" />
      <attributes-setup :value="$store.getters['attributes/settings']" />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { AttributesSetup } from '@deip/attributes-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'AdminAttributesSettings',
    components: {
      AttributesSetup,

      VeStack,
      VexSection,
      VexSectionTitle
    }
  };
</script>
