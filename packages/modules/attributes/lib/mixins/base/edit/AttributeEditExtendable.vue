<template>
  <div>
    <attribute-edit-meta v-model="internalValue" />
    <attribute-edit-props v-model="internalValue" can-be-multiple />
    <v-divider class="my-6" />
    <attribute-edit-options v-model="internalValue.valueOptions" />
  </div>
</template>

<script>

  import { attributeEdit } from './attributeEdit';

  import AttributeEditProps from './_partials/AttributeEditProps';
  import AttributeEditMeta from './_partials/AttributeEditMeta';
  import AttributeEditOptions from './_partials/AttributeEditOptions';

  export default {
    name: 'AttributeEditExtendable',
    components: {
      AttributeEditOptions,
      AttributeEditMeta,
      AttributeEditProps
    },
    mixins: [attributeEdit]
  };
</script>
