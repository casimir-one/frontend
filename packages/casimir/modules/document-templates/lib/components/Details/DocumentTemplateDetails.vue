<template>
  <ve-stack gap="24">
    <h2 class="text-h2">
      {{ template.title }}
    </h2>
    <vue-editorjs-parser :value="template.body" />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';

  import { VeStack } from '@casimir.one/vue-elements';
  import { VueEditorjsParser } from '@casimir.one/vue-editorjs';

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
