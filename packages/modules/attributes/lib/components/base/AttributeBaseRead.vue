<template>
  <component
    :is="attributeComponent"
    v-if="Object.keys(attribute).length && attribute.value"
    :attribute="attribute"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent } from '../../mixins/base';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import { AttributeCheckboxRead } from './Checkbox';

  export default {
    name: 'AttributeBaseRead',
    components: {
      AttributeCheckboxRead,
    },
    mixins: [attributeTypeComponent, BindsAttrs],
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
