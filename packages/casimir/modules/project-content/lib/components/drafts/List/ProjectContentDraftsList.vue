<template>
  <project-content-drafts-data-provider
    v-bind="providerProps"
  >
    <template #default="{drafts, loading}">
      <v-data-table
        :headers="tableHeaders"
        :items="drafts"
        :loading="loading"
        disable-sort
        disable-pagination
        hide-default-footer
        @click:row="handleRowClick"
      >
        <template #item.type>
          {{ $t('module.projectContent.draftList.draft') }}
        </template>

        <template #item.title="{item}">
          <span>{{ item.title }}</span>
          <span v-if="isDraftProposed(item)" class="ml-2 orange--text">
            ({{ $t('module.projectContent.draftList.proposed') }})
          </span>
        </template>

        <template #item.actions="{item}">
          <vex-tooltip
            v-if="isDraftInProgress(item)"
            :tooltip="$t('module.projectContent.draft.publish')"
            bottom
          >
            <v-btn
              icon
              small
              :loading="publishingDraftId === item._id"
              :disabled="publishingDraftId === item._id"
              @click.stop="handlePublishClick(item)"
            >
              <v-icon small>
                mdi-publish
              </v-icon>
            </v-btn>
          </vex-tooltip>

          <vex-tooltip
            v-if="isDraftInProgress(item)"
            :tooltip="$t('module.projectContent.draft.delete')"
            bottom
          >
            <v-btn
              icon
              small
              :loading="removingDraftId === item._id"
              :disabled="removingDraftId === item._id "
              @click.stop="handleRemoveClick(item)"
            >
              <v-icon small>
                mdi-delete
              </v-icon>
            </v-btn>
          </vex-tooltip>
        </template>
      </v-data-table>
    </template>
  </project-content-drafts-data-provider>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { VexTooltip } from '@deip/vuetify-extended';
  import { PROJECT_CONTENT_DRAFT_STATUS } from '@deip/constants';
  import ProjectContentDraftsDataProvider from '../DataProvider';

  /**
   * Project content drafts list component
   * @required ProjectContentDraftsDataProvider
   * @required VexTooltip
   */
  export default defineComponent({
    name: 'ProjectContentDraftsList',

    components: {
      ProjectContentDraftsDataProvider,
      VexTooltip
    },

    props: {
      ...ProjectContentDraftsDataProvider.options.props
    },

    data() {
      return {
        publishingDraftId: null,
        removingDraftId: null,
        tableHeaders: [
          {
            text: this.$t('module.projectContent.draftList.type'),
            value: 'type'
          },
          {
            text: this.$t('module.projectContent.draftList.title'),
            value: 'title',
            width: '60%'
          },
          {
            value: 'actions',
            width: '20%'
          }
        ]
      };
    },

    computed: {
      /**
       * Get computed provider properties
       */
      providerProps() {
        return getBindableProps.call(this, ProjectContentDraftsDataProvider.options.props);
      }
    },

    methods: {
      /**
       * Check if draft status is proposed
       *
       * @param {Object} draft
       */
      isDraftProposed(draft) {
        return draft.status === PROJECT_CONTENT_DRAFT_STATUS.PROPOSED;
      },
      /**
       * Check if draft status is in progress
       *
       * @param {Object} draft
       */
      isDraftInProgress(draft) {
        return draft.status === PROJECT_CONTENT_DRAFT_STATUS.IN_PROGRESS;
      },

      handleRowClick(draft) {
        /**
         * Triggers when user clicks the row
         *
         * @property {Object} draft
         */
        this.$emit('click-row', draft);
      },

      emitSuccessPublish() {
        /**
         * Triggers when draft is successfully published
         */
        this.$emit('publish-success');
      },

      emitSuccessRemove() {
        /**
         * Triggers when draft is successfully removed
         */
        this.$emit('remove-success');
      },
      /**
       * Publish draft
       *
       * @param {Object} draft
       */
      async publishDraft(draft) {
        try {
          const payload = {
            initiator: this.$currentUser,
            data: draft
          };
          await this.$store.dispatch('projectContentDrafts/publish', payload);
          this.emitSuccessPublish();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Remove draft
       *
       * @param {Object} draft
       */
      async removeDraft(draft) {
        try {
          await this.$store.dispatch('projectContentDrafts/remove', draft._id);
          this.emitSuccessRemove();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Handle publish draft click
       *
       * @event click
       * @param {Object} draft
       */
      async handlePublishClick(draft) {
        this.publishingDraftId = draft._id;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmPublish.message', { title: draft.title }),
          { title: this.$t('module.projectContent.draft.confirmPublish.title') }
        );

        if (isConfirmed) {
          await this.publishDraft(draft);
        }
        this.publishingDraftId = null;
      },
      /**
       * Handle remove draft click
       *
       * @event click
       * @param {Object} draft
       */
      async handleRemoveClick(draft) {
        this.removingDraftId = draft._id;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmDelete.message', { title: draft.title }),
          { title: this.$t('module.projectContent.draft.confirmDelete.title') }
        );

        if (isConfirmed) {
          await this.removeDraft(draft);
        }
        this.removingDraftId = null;
      }
    }
  });
</script>
