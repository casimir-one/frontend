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
              {{ $t('module.projectContent.moderation.card.decline') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              :disabled="disabled"
              @click="handleApproveClick"
            >
              {{ $t('module.projectContent.moderation.card.approve') }}
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
  import { NFT_ITEM_METADATA_DRAFT_STATUS } from '@deip/constants';
  import { AccessService } from '@deip/access-service';
  import { dateMixin } from '@deip/platform-components';
  import { VeStack, VeLineClamp } from '@deip/vue-elements';
  import { NftItemDraftDeclineDialog } from '../NftItemDraftDeclineDialog';

  const accessService = AccessService.getInstance();

  /**
   * Nft item moderation card
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
      /** Nft item draft */
      nftItemDraft: {
        type: Object,
        required: true
      },

      /** Message to show in notification after success approve */
      successApproveMessage: {
        type: String,
        default() { return this.$t('module.projectContent.moderation.card.approveSuccess'); }
      },

      /** Message to show in notification after success decline */
      successDeclineMessage: {
        type: String,
        default() {
          return this.$t('module.projectContent.moderation.declineDialog.declineSuccess');
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
        const { DEIP_SERVER_URL } = this.$env;
        const authorization = accessService.getAccessToken();
        const { hash } = this.nftItemDraft.packageFiles[0];

        // eslint-disable-next-line max-len
        return `${DEIP_SERVER_URL}/api/v2/project-content/package/${this.nftItemDraft._id}/${hash}?authorization=${authorization}`;
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
          this.$t('module.projectContent.moderation.card.approveConfirm.message',
                  { title: this.nftItemDraft.title }),
          { title: this.$t('module.projectContent.moderation.card.approveConfirm.title') }
        );

        if (isConfirmed) {
          await this.approveNftItemDraft();
        }
      },

      /** Approve nft item draft */
      async approveNftItemDraft() {
        try {
          const payload = {
            data: {
              _id: this.nftItemDraft._id,
              status: NFT_ITEM_METADATA_DRAFT_STATUS.APPROVED
            }
          };

          await this.$store.dispatch('projectContentDrafts/moderate', payload);

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
