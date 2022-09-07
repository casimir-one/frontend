<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(submit)"
    >
      <ve-stack :gap="24">
        <layout-renderer
          :value="draft"
          :schema="internalSchema"
          :schema-data="internalSchemaData"
        />

        <v-divider />

        <div class="d-flex align-center">
          <v-spacer />
          <ve-stack flow="column" :gap="8">
            <v-btn
              color="primary"
              text
              :disabled="loading || disabled"
              @click="handleCancelClick"
            >
              {{ $t('module.nftItems.form.cancel') }}
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              depressed
              :disabled="disabled || untouched || invalid"
              :loading="loading"
            >
              {{ submitLabel }}
            </v-btn>
          </ve-stack>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';
  import { formFactory } from '@casimir.one/platform-components';

  import { VeStack } from '@casimir.one/vue-elements';
  import { AttributeScope, NFT_ITEM_METADATA_FORMAT } from '@casimir.one/platform-core';
  import { attributedDetailsFactory, LayoutRenderer } from '@casimir.one/layouts-module';
  import { attributeMethodsFactory, expandAttributes } from '@casimir.one/attributes-module';

  import { AccessService } from '@casimir.one/access-service';

  const accessService = AccessService.getInstance();

  /**
   * NFT item draft form component
   */
  export default defineComponent({
    name: 'NftItemDraftForm',

    components: {
      VeStack,
      LayoutRenderer
    },

    mixins: [formFactory('draft'), attributedDetailsFactory('draft')],

    props: {
      draft: {
        type: Object,
        default: () => {}
      },
      /**
       * NFT collection info
       */
      nftCollection: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        filesInputLoading: false,
        NFT_ITEM_METADATA_FORMAT
      };
    },

    computed: {
      internalSchemaData() {
        return {
          ...attributeMethodsFactory(
            expandAttributes(this.draft),
            {
              scopeName: AttributeScope.NFT_ITEM,
              scopeId: {
                nftItemId: this.draft.nftItemId,
                nftCollectionId: this.draft.nftCollectionId
              }
            }
          ),
          ...this.schemaData
        };
      },
      /**
       * Get computed submit label
       */
      submitLabel() {
        return this.isEditMode
          ? this.$t('module.nftItems.form.update')
          : this.$t('module.nftItems.form.create');
      },

      /**
       * Get team
       */
      team() {
        return this.$store.getters['teams/one'](this.nftCollection.issuer);
      }
    },

    async created() {
      this.setExistingFiles();
    },

    methods: {
      /**
       * Get Nft item draft url by file hash
       *
       * @param {string} fileHash
       */
      getContentUrl(fileHash) {
        const { DEIP_SERVER_URL } = this.$env;

        return `${DEIP_SERVER_URL}/api/v2/nft-items/package/${this.draft._id}/
        ${fileHash}?download=true&authorization=${accessService.getAccessToken()}`;
      },
      /**
       * Set form data files
       */
      async setExistingFiles() {
        if (this.formData.packageFiles?.length > 0) {
          this.filesInputLoading = true;

          try {
            this.formData.files = await Promise.all(this.formData.packageFiles.map(async (file) => {
              const res = await fetch(this.getContentUrl(file.hash));
              return new File([res.blob()], file.filename);
            }));
          } catch (error) {
            console.error('Failed to upload files', error);
          }
          this.filesInputLoading = false;
        }
      },
      /**
       * Create draft
       *
       * @param {Object} data
       */
      async createDraft(data) {
        try {
          await this.$store.dispatch('nftItemDrafts/create', { data });
          this.emitSuccess();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Update draft
       *
       * @param {Object} data
       */
      async updateDraft(data) {
        try {
          await this.$store.dispatch('nftItemDrafts/update',
                                     { data: { ...this.draft, ...data } });
          this.emitSuccess();
        } catch (error) {
          console.error(error);
        }
      },
      /**
       * Triggers when user submits form
       *
       * @event submit
       */
      async submit() {
        this.loading = true;
        const data = {
          nftCollectionId: this.nftCollection._id,
          title: this.formData.title,
          authors: this.formData.authors,
          owner: this.nftCollection.issuer,
          ownedByTeam: this.nftCollection.issuedByTeam,
          formatType: this.formData.formatType,
          nftItemId: this.nftCollection.nextNftItemId
        };

        if (this.formData.formatType === NFT_ITEM_METADATA_FORMAT.JSON) {
          data.jsonData = this.formData.jsonData;
        } else if (this.formData.formatType === NFT_ITEM_METADATA_FORMAT.PACKAGE) {
          data.files = this.formData.files;
        }

        if (this.isEditMode) {
          await this.updateDraft(data);
        } else {
          await this.createDraft(data);
        }
        this.loading = false;
      },

      emitSuccess() {
        /**
         * Success event
         */
        this.$emit('success');
      },

      emitCancel() {
        /**
         * Triggers by clicking on cancel button
         */
        this.$emit('cancel');
      },
      /**
       * Handle cancel click
       *
       * @event click
       */
      handleCancelClick() {
        this.emitCancel();
      }
    }
  });
</script>
