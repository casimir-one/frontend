<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" />
  </div>
</template>

<script>
  import { attributeEdit } from './attributeEdit';

  import AttributeEditProps from './_partials/AttributeEditProps';
  import AttributeEditMeta from './_partials/AttributeEditMeta';

  export default {
    name: 'AttributeEditBase',
    components: {
      AttributeEditMeta,
      AttributeEditProps
    },
    mixins: [attributeEdit]
  };
</script>
