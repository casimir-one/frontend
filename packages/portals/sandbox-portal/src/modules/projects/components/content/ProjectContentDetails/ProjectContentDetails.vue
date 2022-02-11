<template>
  <vex-section>
    <ve-stack :gap="8">
      <v-sheet>
        <v-btn
          text
          x-small
          plain
          :to="projectRoute"
        >
          <v-icon left>
            mdi-arrow-left
          </v-icon>
          {{ $t('projects.contentDraft.details.backToProject') }}
        </v-btn>
      </v-sheet>

      <c-project-content-details :content-id="contentId" />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { ProjectContentDetails as CProjectContentDetails } from '@deip/project-content-module';
  import { VexSection } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'ProjectContentDetails',

    components: {
      VexSection,
      VeStack,
      CProjectContentDetails
    },

    props: {
      projectId: {
        type: String,
        required: true
      },
      contentId: {
        type: String,
        required: true
      }
    },

    computed: {
      projectRoute() {
        return { name: 'projects.details', params: { projectId: this.projectId } };
      }
    }
  };
</script>
