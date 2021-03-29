<template>
  <component
    :is="attributeComponent"
    v-model="internalValue"

    v-bind="attrs$"
  />
</template>

<script>
  import { attributeTypeComponent } from '../mixins/base';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { AttributeCheckboxEdit } from './Checkbox';
  import { AttributeTextEdit } from './Text';
  import { AttributeTextareaEdit } from './Textarea';
  import { AttributeSwitchEdit } from './Switch';
  import { AttributeSelectEdit } from './Select';

  import { ATTR_TYPES } from '../variables';

  export default {
    name: 'AttributeEdit',
    components: {
      AttributeCheckboxEdit,
      AttributeTextEdit,
      AttributeTextareaEdit,
      AttributeSwitchEdit,
      AttributeSelectEdit,
    },
    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      type: {
        type: String,
        default: ATTR_TYPES.TEXT,
        validator(val) {
          return Object.values(ATTR_TYPES)
            .indexOf(val) !== -1;
        }
      }
    }
  };
</script>
