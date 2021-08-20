<template>
  <ve-stack gap="24">
    <h2 class="text-h2">
      {{ template.title }}
    </h2>
    <vue-editorjs-renderer :value="template.body" />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  import { VeStack } from '@deip/vue-elements';
  import VueEditorjsRenderer from '@deip/vue-editorjs/renderer';

  export default defineComponent({
    name: 'DocumentTemplateDetails',

    components: { VeStack, VueEditorjsRenderer },

    props: {
      template: {
        type: Object,
        default: () => {}
      }
    }
  });
</script>
