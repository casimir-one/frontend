<template>
  <nft-item-drafts-data-provider
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
          {{ $t('module.nftItems.draftList.draft') }}
        </template>

        <template #item.title="{item}">
          <span>{{ item.title }}</span>
          <span v-if="isDraftProposed(item)" class="ml-2 orange--text">
            ({{ $t('module.nftItems.draftList.proposed') }})
          </span>
        </template>

        <template #item.actions="{item}">
          <vex-tooltip
            v-if="isDraftInProgress(item)"
            :tooltip="$t('module.nftItems.draft.publish')"
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
            :tooltip="$t('module.nftItems.draft.delete')"
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
  </nft-item-drafts-data-provider>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { VexTooltip } from '@deip/vuetify-extended';
  import { NFT_ITEM_METADATA_DRAFT_STATUS } from '@deip/constants';
  import NftItemDraftsDataProvider from '../DataProvider';

  /**
   * NFT item drafts list component
   */
  export default defineComponent({
    name: 'NftItemDraftsList',

    components: {
      NftItemDraftsDataProvider,
      VexTooltip
    },

    props: {
      ...NftItemDraftsDataProvider.options.props
    },

    data() {
      return {
        publishingDraftId: null,
        removingDraftId: null,
        tableHeaders: [
          {
            text: this.$t('module.nftItems.draftList.type'),
            value: 'type'
          },
          {
            text: this.$t('module.nftItems.draftList.title'),
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
        return getBindableProps.call(this, NftItemDraftsDataProvider.options.props);
      }
    },

    methods: {
      /**
       * Check if draft status is proposed
       *
       * @param {Object} draft
       */
      isDraftProposed(draft) {
        return draft.status === NFT_ITEM_METADATA_DRAFT_STATUS.PROPOSED;
      },
      /**
       * Check if draft status is in progress
       *
       * @param {Object} draft
       */
      isDraftInProgress(draft) {
        return draft.status === NFT_ITEM_METADATA_DRAFT_STATUS.IN_PROGRESS;
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
            data: {
              _id: draft._id,
              issuer: draft.owner,
              nftItemId: draft.nftItemId,
              recipient: draft.owner, // TODO: should be fixed to owner on backend
              ownedByTeam: draft.ownedByTeam,
              nftCollectionId: draft.nftCollectionId,
              metadata: {
                nftItemMetadataDraftId: draft._id,
                ...draft
              }
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
       *
       * @param {Object} draft
       */
      async removeDraft(draft) {
        try {
          await this.$store.dispatch('nftItemDrafts/remove', draft._id);
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
          this.$t('module.nftItems.draft.confirmPublish.message', { title: draft.title }),
          { title: this.$t('module.nftItems.draft.confirmPublish.title') }
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
          this.$t('module.nftItems.draft.confirmDelete.message', { title: draft.title }),
          { title: this.$t('module.nftItems.draft.confirmDelete.title') }
        );

        if (isConfirmed) {
          await this.removeDraft(draft);
        }
        this.removingDraftId = null;
      }
    }
  });
</script>
