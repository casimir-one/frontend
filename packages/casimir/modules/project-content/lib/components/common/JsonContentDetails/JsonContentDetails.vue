<template>
  <vue-editorjs-parser :value="content.jsonData" />
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  import { VueEditorjsParser } from '@deip/vue-editorjs';

  export default defineComponent({
    name: 'JsonContentDetails',

    components: { VueEditorjsParser },

    props: {
      content: {
        type: Object,
        required: true
      }
    }
  });
</script>
