<template>
  <div>
    <v-card outlined>
      <v-img
        max-height="230"
        aspect-ratio="1.3"
        :src="src"
      />

      <v-card-text class="grey--text text--darken-4">
        <ve-stack :gap="32">
          <ve-stack :gap="4">
            <div class="text-h6">
              {{ nftItemDraft.title }}
            </div>
            <div class="text-subtitle-3">
              {{ creatorName }}
            </div>
            <ve-stack :gap="8" flow="column" class="text-body-1 grey--text text--lighten-2">
              <span>{{ $$formatDate($$parseISO(nftItemDraft.createdAt), 'PP') }}</span>
              <v-icon>mdi-circle-small</v-icon>
              <span class="price-container">
                {{ nftItemDraft.metadata.price.amount }}
                {{ nftItemDraft.metadata.price.symbol }}

              </span>
            </ve-stack>
          </ve-stack>

          <ve-line-clamp
            v-if="nftItemDraft.metadata.description"
            class="text-body-1"
            :lines="4"
          >
            {{ nftItemDraft.metadata.description }}
          </ve-line-clamp>

          <ve-stack :gap="8" flow="column" class="align-end justify-end">
            <v-btn
              text
              outlined
              small
              :disabled="disabled"
              @click="handleDeclineClick"
            >
              {{ $t('module.nftItems.moderation.card.decline') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              :disabled="disabled"
              @click="handleApproveClick"
            >
              {{ $t('module.nftItems.moderation.card.approve') }}
            </v-btn>
          </ve-stack>
        </ve-stack>
      </v-card-text>
    </v-card>

    <nft-item-draft-decline-dialog
      v-if="isDeclineDialogOpened"
      v-model="isDeclineDialogOpened"
      :nft-item-draft="nftItemDraft"
      :success-message="successDeclineMessage"
      @success="handleDeclineSuccess"
    />
  </div>
</template>

<script>
  import { NftItemMetadataDraftStatus } from '@casimir/platform-core';
  import { NonFungibleTokenService } from '@casimir/token-service';

  import { dateMixin } from '@deip/platform-components';
  import { VeStack, VeLineClamp } from '@deip/vue-elements';
  import { NftItemDraftDeclineDialog } from '../NftItemDraftDeclineDialog';

  const nonFungibleTokenService = NonFungibleTokenService.getInstance();

  /**
   * NFT item moderation card
   */
  export default {
    name: 'NftItemDraftModerationCard',

    components: {
      VeStack,
      VeLineClamp,
      NftItemDraftDeclineDialog
    },

    mixins: [dateMixin],

    props: {
      /** NFT item draft */
      nftItemDraft: {
        type: Object,
        required: true
      },

      /** Message to show in notification after success approve */
      successApproveMessage: {
        type: String,
        default() { return this.$t('module.nftItems.moderation.card.approveSuccess'); }
      },

      /** Message to show in notification after success decline */
      successDeclineMessage: {
        type: String,
        default() {
          return this.$t('module.nftItems.moderation.declineDialog.declineSuccess');
        }
      }
    },

    data() {
      return {
        isDeclineDialogOpened: false,
        loading: false,
        disabled: false
      };
    },

    computed: {
      /** Image src */
      src() {
        const { nftCollectionId, _id, packageFiles: [{ hash }] } = this.nftItemDraft;

        return nonFungibleTokenService.getNftItemFileSrc(nftCollectionId, _id, hash);
      },

      /** Creator name */
      creatorName() {
        const userData = this.$store.getters['users/one'](this.nftItemDraft.authors[0]);
        if (!userData?.attributes) return null;
        return this.$attributes
          .getMappedData('user.name', userData.attributes)?.value;
      }
    },

    methods: {
      /** Handle decline button click */
      handleDeclineClick() {
        this.isDeclineDialogOpened = true;
      },

      /** Disable buttons after decline */
      handleDeclineSuccess() {
        this.setDisabled(true);
      },

      /**
       * Set disabled
       * @param {boolean} value
       */
      setDisabled(value) {
        this.disabled = value;
      },

      /** Handle approve button click */
      async handleApproveClick() {
        const isConfirmed = await this.$confirm(
          this.$t('module.nftItems.moderation.card.approveConfirm.message',
                  { title: this.nftItemDraft.title }),
          { title: this.$t('module.nftItems.moderation.card.approveConfirm.title') }
        );

        if (isConfirmed) {
          await this.approveNftItemDraft();
        }
      },

      /** Approve NFT item draft */
      async approveNftItemDraft() {
        try {
          const payload = {
            data: {
              _id: this.nftItemDraft._id,
              status: NftItemMetadataDraftStatus.APPROVED
            }
          };

          await this.$store.dispatch('nftItemDrafts/moderate', payload);

          this.$notifier.showSuccess(this.successApproveMessage);
          this.setDisabled(true);
        } catch (error) {
          console.error(error?.error || error);
          this.$notifier.showError(error?.error?.message || error);
        }
      }
    }
  };
</script>
