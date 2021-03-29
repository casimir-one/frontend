<template>
  <vex-video-embed
    :src="attribute.value"
  />
</template>

<script>
  import { VexVideoEmbed } from '@deip/vuetify-extended';
  import { attributeRead } from '../../mixins/base';

  export default {
    name: 'AttributeVideoUrlRead',
    components: {
      VexVideoEmbed
    },
    mixins: [attributeRead]
  };
</script>
