<template>
  <vex-block
    v-if="!loading && draft"
    :title="draft.title"
  >
    <template #title-append>
      <template v-if="withActions && canManage">
        <v-btn
          color="error"
          text
          small
          :disabled="actionLoading"
          @click="handleRemoveClick"
        >
          {{ $t('module.projectContent.draft.delete') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          small
          :disabled="actionLoading"
          @click="handleEditClick"
        >
          {{ $t('module.projectContent.draft.edit') }}
        </v-btn>

        <v-btn
          color="primary"
          small
          :disabled="actionLoading"
          @click="handlePublishClick"
        >
          {{ $t('module.projectContent.draft.publish') }}
        </v-btn>
      </template>

      <slot v-else name="title-append" />
    </template>

    <span v-if="draft.contentType" class="font-weight-medium">
      {{ $t(`module.projectContent.types.${NFT_ITEM_METADATA_TYPES[draft.contentType]}`) }}
    </span>

    <div>
      <span>{{ $t('module.projectContent.details.authors') }}</span>
      <users-list
        view-type="stack"
        :users="draft.authors"
      />
    </div>

    <package-content-details
      v-if="draft.formatType === NFT_ITEM_METADATA_FORMAT.PACKAGE"
      :content="draft"
    />

    <json-content-details
      v-if="draft.formatType === NFT_ITEM_METADATA_FORMAT.JSON"
      :content="draft"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock, contextMixin } from '@deip/vuetify-extended';
  import { NFT_ITEM_METADATA_FORMAT, NFT_ITEM_METADATA_TYPES } from '@deip/constants';
  import { UsersList } from '@deip/users-module';

  import PackageContentDetails from '../../common/PackageContentDetails';
  import JsonContentDetails from '../../common/JsonContentDetails';

  /**
   * Project content drafts details component
   * @required VexBlock
   * @required UsersList
   * @required PackageContentDetails
   * @required JsonContentDetails
   */
  export default defineComponent({
    name: 'ProjectContentDraftDetails',

    components: {
      VexBlock,
      UsersList,
      PackageContentDetails,
      JsonContentDetails
    },

    mixins: [contextMixin],

    props: {
      /**
       * Content id
       */
      contentId: {
        type: String,
        required: true
      },
      /**
       * Should contain delete, edit and publish drafts buttons
       */
      withActions: {
        type: Boolean,
        default: false
      },
      /**
       * Can manage drafts
       */
      canManage: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        loading: false,
        actionLoading: false,
        NFT_ITEM_METADATA_FORMAT,
        NFT_ITEM_METADATA_TYPES
      };
    },

    computed: {
      /**
       * Get computed project content draft by content id
       */
      draft() {
        return this.$store.getters['projectContentDrafts/one'](this.contentId);
      }
    },

    created() {
      this.getDraft();
    },

    methods: {
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

      emitEditClick() {
        /**
         * Triggers when draft is clicked to edit
         */
        this.$emit('edit-click');
      },
      /**
       * Get draft by content id
       */
      async getDraft() {
        this.loading = true;
        try {
          await this.$store.dispatch('projectContentDrafts/getOne', this.contentId);
        } catch (error) {
          console.error(error);
        }
        this.loading = false;
      },
      /**
       * Publish draft
       */
      async publishDraft() {
        try {
          const payload = {
            initiator: this.$currentUser,
            data: this.draft
          };
          await this.$store.dispatch('projectContentDrafts/publish', payload);
          this.emitSuccessPublish();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Remove draft
       */
      async removeDraft() {
        try {
          await this.$store.dispatch('projectContentDrafts/remove', this.draft._id);
          this.emitSuccessRemove();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Handle publish draft click
       *
       * @event click
       */
      async handlePublishClick() {
        this.actionLoading = true;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmPublish.message',
                  { title: this.draft.title }),
          { title: this.$t('module.projectContent.draft.confirmPublish.title') }
        );

        if (isConfirmed) {
          await this.publishDraft();
        }
        this.actionLoading = false;
      },
      /**
       * Handle remove draft click
       *
       * @event click
       */
      async handleRemoveClick() {
        this.actionLoading = true;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmDelete.message', { title: this.draft.title }),
          { title: this.$t('module.projectContent.draft.confirmDelete.title') }
        );

        if (isConfirmed) {
          await this.removeDraft();
        }
        this.actionLoading = false;
      },
      /**
       * Handle edit draft click
       *
       * @event click
       */
      handleEditClick() {
        this.emitEditClick();
      }
    }
  });
</script>
