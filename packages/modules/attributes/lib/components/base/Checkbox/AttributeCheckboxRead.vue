<template>
  <div v-if="attribute.value">
    {{ attributeInfo.title }}
  </div>
</template>

<script>
  import { attributeRead } from '../../../mixins/base';

  export default {
    name: 'AttributeCheckboxRead',
    mixins: [attributeRead]
  };
</script>
