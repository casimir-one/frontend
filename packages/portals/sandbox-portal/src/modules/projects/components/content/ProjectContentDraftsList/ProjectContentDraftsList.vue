<template>
  <vex-block :title="$t('projects.details.drafts')">
    <template #title-append>
      <v-btn
        color="primary"
        small
        text
        :to="{ name: 'projects.content.draft.create', params: { projectId: projectId } }"
      >
        {{ $t('projects.details.create') }}
      </v-btn>
    </template>

    <c-project-content-drafts-list
      :project-id="projectId"
      @click-row="handleClickRow"
      @publish-success="handlePublishSuccess"
      @remove-success="handleRemoveSuccess"
    />
  </vex-block>
</template>

<script>
  import { VexBlock } from '@deip/vuetify-extended';
  import { ProjectContentDraftsList as CProjectContentDraftsList } from '@deip/project-content-module';

  export default {
    name: 'ProjectContentDraftsList',

    components: {
      VexBlock,
      CProjectContentDraftsList
    },

    props: {
      projectId: {
        type: String,
        required: true
      }
    },

    methods: {
      handleClickRow(draft) {
        this.$router.push({ name: 'projects.content.draft.details', params: { projectId: this.projectId, draftId: draft._id } });
      },

      handlePublishSuccess() {
        this.$notifier.showSuccess(this.$t('projects.contentDraft.details.successPublish'));
        this.$store.dispatch('projectContent/getListByProjectId', this.projectId);
      },

      handleRemoveSuccess() {
        this.$notifier.showSuccess(this.$t('projects.contentDraft.details.successRemove'));
      }
    }
  };
</script>
