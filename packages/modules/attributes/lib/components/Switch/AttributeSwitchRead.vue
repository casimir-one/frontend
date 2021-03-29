<template>
  <div v-if="attribute.value">
    {{ attributeInfo.title }}
  </div>
</template>

<script>
  import { attributeRead } from '../../mixins/base';

  export default {
    name: 'AttributesSwitchRead',
    mixins: [attributeRead]
  };
</script>
