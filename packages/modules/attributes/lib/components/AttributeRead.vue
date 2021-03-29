<template>
  <component
    :is="attributeComponent"
    v-if="Object.keys(attribute).length && attribute.value"
    :attribute="attribute"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent } from '../mixins/base';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import { AttributeCheckboxRead } from './Checkbox';
  import { AttributeTextRead } from './Text';
  import { AttributeTextareaRead } from './Textarea';
  import { AttributeSwitchRead } from './Switch';

  export default {
    name: 'AttributeRead',
    components: {
      AttributeCheckboxRead,
      AttributeTextRead,
      AttributeTextareaRead,
      AttributeSwitchRead,
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
