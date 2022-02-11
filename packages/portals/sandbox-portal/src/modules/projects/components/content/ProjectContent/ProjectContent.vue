<template>
  <vex-block>
    <template #title>
      <div class="text-h4">
        {{ $t('projects.details.content') }}
      </div>
    </template>

    <ve-stack>
      <project-content-list :project-id="projectId" />

      <project-content-drafts-list :project-id="projectId" />
    </ve-stack>
  </vex-block>
</template>

<script>
  import { VexBlock } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { ProjectContentList } from '../ProjectContentList';
  import { ProjectContentDraftsList } from '../ProjectContentDraftsList';

  export default {
    name: 'ProjectContent',

    components: {
      VexBlock,
      VeStack,
      ProjectContentList,
      ProjectContentDraftsList

    },
    props: {
      projectId: {
        type: String,
        required: true
      }
    }
  };
</script>
