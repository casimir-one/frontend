<template>
  <vue-editorjs-parser :value="content.jsonData" />
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  import { VueEditorjsParser } from '@deip/vue-editorjs';

  /**
   * Component for json content details
   * @requires VueEditorjsParser
   */
  export default defineComponent({
    name: 'JsonContentDetails',

    components: { VueEditorjsParser },

    props: {
      /**
       * Content info
       */
      content: {
        type: Object,
        required: true
      }
    }
  });
</script>
