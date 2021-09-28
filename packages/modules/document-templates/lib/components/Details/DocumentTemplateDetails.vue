<template>
  <ve-stack gap="24">
    <h2 class="text-h2">
      {{ template.title }}
    </h2>
    <vue-editorjs-parser :value="template.body" />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  import { VeStack } from '@deip/vue-elements';
  import VueEditorjsParser from '@deip/vue-editorjs';

  export default defineComponent({
    name: 'DocumentTemplateDetails',

    components: { VeStack, VueEditorjsParser },

    props: {
      template: {
        type: Object,
        default: () => {}
      }
    }
  });
</script>
