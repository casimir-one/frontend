<template>
  <ve-stack gap="24">
    <h2 class="text-h2">
      {{ template.title }}
    </h2>
    <vue-editorjs-parser :value="template.body" />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';

  import { VeStack } from '@casimir/vue-elements';
  import { VueEditorjsParser } from '@casimir/vue-editorjs';

  export default defineComponent({
    name: 'DocumentTemplateDetails',

    components: { VeStack, VueEditorjsParser },

    props: {
      /**
       * Document template
       */
      template: {
        type: Object,
        default: () => {}
      }
    }
  });
</script>
