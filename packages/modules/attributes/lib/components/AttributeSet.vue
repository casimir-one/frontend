<template>
  <div :class="{'visually-hidden': attribute.isHidden}">
    <component
      :is="attributeComponent"
      v-model="internalValue"
      :attribute="attribute"
      v-bind="attrs$"
    />
  </div>
</template>

<script>
  import { attributeTypeComponent } from '../mixins/base';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { AttributeCheckboxSet } from './Checkbox';
  import { AttributeTextSet } from './Text';

  export default {
    name: 'AttributeSet',
    components: {
      AttributeCheckboxSet,
      AttributeTextSet,
    },

    mixins: [attributeTypeComponent, Proxyable, BindsAttrs],
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
