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
          {{ $t('module.nftItems.draft.delete') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          small
          :disabled="actionLoading"
          @click="handleEditClick"
        >
          {{ $t('module.nftItems.draft.edit') }}
        </v-btn>

        <v-btn
          color="primary"
          small
          :disabled="actionLoading"
          @click="handlePublishClick"
        >
          {{ $t('module.nftItems.draft.publish') }}
        </v-btn>
      </template>

      <slot v-else name="title-append" />
    </template>

    <div>
      <span>{{ $t('module.nftItems.details.authors') }}</span>
      <users-list
        view-type="stack"
        :users="draft.authors"
      />
    </div>

    <nft-item-details
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
  import { NFT_ITEM_METADATA_FORMAT } from '@deip/constants';
  import { UsersList } from '@deip/users-module';

  import NftItemDetails from '../../common/NftItemDetails';
  import JsonContentDetails from '../../common/JsonContentDetails';

  /**
   * NFT item drafts details component
   */
  export default defineComponent({
    name: 'NftItemDraftDetails',

    components: {
      VexBlock,
      UsersList,
      NftItemDetails,
      JsonContentDetails
    },

    mixins: [contextMixin],

    props: {
      /**
       * NFT item draft id
       */
      nftItemDraftId: {
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
        NFT_ITEM_METADATA_FORMAT
      };
    },

    computed: {
      /**
       * Get computed NFT item draft by id
       */
      draft() {
        return this.$store.getters['nftItemDrafts/one'](this.nftItemDraftId);
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
       * Get draft by id
       */
      async getDraft() {
        this.loading = true;
        try {
          await this.$store.dispatch('nftItemDrafts/getOne', this.nftItemDraftId);
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
            data: {
              _id: this.draft._id,
              issuer: this.draft.owner,
              nftItemId: this.draft.nftItemId,
              recipient: this.draft.owner, // TODO: should be fixed to owner on backend
              ownedByTeam: this.draft.ownedByTeam,
              nftCollectionId: this.draft.nftCollectionId,
              nftItemMetadataDraftId: this.draft._id,
              ...this.draft
            }
          };
          await this.$store.dispatch('nftItemDrafts/publish', payload);
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
          await this.$store.dispatch('nftItemDrafts/remove', this.draft._id);
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
          this.$t('module.nftItems.draft.confirmPublish.message',
                  { title: this.draft.title }),
          { title: this.$t('module.nftItems.draft.confirmPublish.title') }
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
          this.$t('module.nftItems.draft.confirmDelete.message', { title: this.draft.title }),
          { title: this.$t('module.nftItems.draft.confirmDelete.title') }
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
