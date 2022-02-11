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

      <c-project-content-draft-details
        :content-id="draftId"
        with-actions
        :can-manage="$$isTeamAdmin"
        @publish-success="handlePublishSuccess"
        @remove-success="handleRemoveSuccess"
        @edit-click="handleEditClick"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { ProjectContentDraftDetails as CProjectContentDraftDetails } from '@deip/project-content-module';
  import { VexSection } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectContentDraftDetails',

    components: {
      VexSection,
      VeStack,
      CProjectContentDraftDetails
    },

    mixins: [rolesFactory('teamId')],

    props: {
      projectId: {
        type: String,
        required: true
      },
      draftId: {
        type: String,
        required: true
      }
    },

    computed: {
      project() {
        if (!this.projectId) {
          return null;
        }
        return this.$store.getters['projects/one'](this.projectId);
      },

      projectRoute() {
        return { name: 'projects.details', params: { projectId: this.projectId } };
      },

      teamId() {
        return this.project?.teamId;
      }
    },

    created() {
      this.getProject();
    },

    methods: {
      async getProject() {
        try {
          await this.$store.dispatch('projects/getOne', this.projectId);
        } catch (error) {
          console.error(error);
        }
      },

      returnToProject() {
        this.$router.push(this.projectRoute);
      },

      handleBackClick() {
        this.returnToProject();
      },

      handlePublishSuccess() {
        this.$notifier.showSuccess(this.$t('projects.contentDraft.details.successPublish'));
        this.$store.dispatch('projectContent/getListByProjectId', this.projectId);
        this.returnToProject();
      },

      handleRemoveSuccess() {
        this.$notifier.showSuccess(this.$t('projects.contentDraft.details.successRemove'));
        this.returnToProject();
      },

      handleEditClick() {
        this.$router.push({ name: 'projects.content.draft.edit', params: { projectId: this.projectId, draftId: this.draftId } });
      }
    }
  };
</script>
