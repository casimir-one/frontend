<template>
  <ve-stack v-if="!loading">
    <div class="pdf-container d-flex flex-column justify-center">
      <v-progress-circular
        v-if="fileLoading"
        indeterminate
        color="primary"
        class="align-self-center"
      />
      <pdf
        v-for="i in pageCount"
        :key="i"
        :page="i"
        :src="pdfSrc"
        @error="handlePdfError"
      />
      <span
        v-if="!contractFileUrl && !fileLoading"
        class="align-self-center"
      >{{ $t('module.contractAgreements.details.noFile') }}</span>
    </div>

    <template v-if="canDiscard || canSign">
      <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
        <v-form
          :disabled="signLoading"
          @submit.prevent="handleSubmit(handleSignContract)"
        >
          <ve-stack :gap="32">
            <validation-provider
              v-if="canSign"
              name="Agreement"
              :rules="{ required: { allowFalse: false } }"
            >
              <v-checkbox
                v-model="formData.agreement"
                class="align-start"
                hide-details
              >
                <template #label>
                  <i18n
                    path="module.contractAgreements.details.agreementMessage"
                    class="text-body-2"
                  >
                    <a :href="tosUrl" target="_blank" @click.stop>
                      {{ $t('module.contractAgreements.details.tos') }}
                    </a>
                  </i18n>
                </template>
              </v-checkbox>
            </validation-provider>

            <v-divider />

            <div class="d-flex">
              <v-spacer />

              <ve-stack flow="column" :gap="16">
                <v-btn
                  v-if="canDiscard"
                  type="button"
                  :text="canSign"
                  color="error"
                  depressed
                  :loading="discardLoading"
                  :disabled="signLoading"
                  @click="handleDiscardContract"
                >
                  {{ $t('module.contractAgreements.discard') }}
                </v-btn>

                <v-btn
                  v-if="canSign"
                  type="submit"
                  color="primary"
                  depressed
                  :disabled="invalid || discardLoading"
                  :loading="signLoading"
                >
                  {{ $t('module.contractAgreements.details.sign') }}
                </v-btn>
              </ve-stack>
            </div>
          </ve-stack>
        </v-form>
      </validation-observer>
    </template>
  </ve-stack>
</template>

<script>
  import pdf from 'vue-pdf';

  import { VeStack } from '@deip/vue-elements';

  const sleep = (time) => new Promise((resolve) => { setTimeout(() => { resolve(); }, time); });
  /**
  * Component for creating contract text in PDF format
  */
  export default {
    name: 'ContractPdfDetails',

    components: {
      pdf,
      VeStack
    },

    props: {
      /**
       * Contract ID
       */
      contractId: {
        type: String,
        default: null
      },
      /**
       * Account ID
       */
      currentPartyId: {
        type: String,
        default: null
      },
      /**
       * Сan the user Sign a contract
       * whether the Sign contract button will be available
       * default: false
       */
      canSign: {
        type: Boolean,
        default: false
      },
      /**
       * Can the user Discard a contract
       * whether the Discard contract button will be available
       * default: false
       */
      canDiscard: {
        type: Boolean,
        default: false
      },
      /**
       * Contract URL for user viewing
       */
      tosUrl: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        formData: {
          agreement: false
        },
        loading: false,
        discardLoading: false,
        signLoading: false,

        pageCount: 0,
        fileLoading: false,
        pdfSrc: null
      };
    },

    computed: {
      contract() {
        return this.$store.getters['contractAgreements/one'](this.contractId);
      },
      contractFileUrl() {
        if (!this.contract?.terms?.filename) {
          return null;
        }
        const { DEIP_SERVER_URL } = this.$env;
        return `${DEIP_SERVER_URL}/api/contract-agreement/file/${this.contract.terms.filename}`;
      }
    },

    created() {
      this.loading = true;
      this.getContract()
        .then(() => {
          this.$emit('contract-loaded', this.contract);
          if (this.contractFileUrl) {
            this.fileLoading = true;
            this.pdfSrc = pdf.createLoadingTask(this.contractFileUrl);
            this.pdfSrc.promise.then((pdfFile) => {
              this.fileLoading = false;
              this.pageCount = pdfFile.numPages;
            });
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    methods: {
      /**
       * Get contract agreement
       */
      getContract() {
        return this.$store.dispatch('contractAgreements/getOne', this.contractId);
      },
      handlePdfError(error) {
        console.error(error);
      },
      /**
       * Discard contract
       */
      async discardContract() {
        const payload = {
          initiator: this.$currentUser,
          data: {
            account: this.currentPartyId,
            proposalId: this.contract.proposalId
          }
        };
        try {
          await this.$store.dispatch('contractAgreements/discard', payload);
          await this.getContract();
          this.$notifier.showSuccess(this.$t('module.contractAgreements.discardAction.success'));
        } catch (error) {
          console.error(error);
          this.$notifier.showError(error.message);
        }
      },
      /**
       * Sign contract
       */
      async signContract() {
        const payload = {
          initiator: this.$currentUser,
          data: {
            account: this.currentPartyId,
            proposalId: this.contract.proposalId
          }
        };

        try {
          await this.$store.dispatch('contractAgreements/acceptProposed', payload);
          await sleep(4000);
          await this.getContract();
          this.$notifier.showSuccess(this.$t('module.contractAgreements.signAction.success'));
        } catch (error) {
          console.error(error);
          this.$notifier.showError(error.message);
        }
      },
      /**
       * Confirm Discard contract
       */
      async handleDiscardContract() {
        const isConfirmed = await this.$confirm(this.$t('module.contractAgreements.discardAction.confirm.message'),
                                                { title: this.$t('module.contractAgreements.discardAction.confirm.title') });
        if (isConfirmed) {
          this.discardLoading = true;
          await this.discardContract();
          this.discardLoading = false;
        }
      },
      /**
       * Confirm Sign contract
       */
      async handleSignContract() {
        const isConfirmed = await this.$confirm(this.$t('module.contractAgreements.signAction.confirm.message'),
                                                { title: this.$t('module.contractAgreements.signAction.confirm.title') });
        if (isConfirmed) {
          this.signLoading = true;
          await this.signContract();
          this.signLoading = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pdf-container {
    min-height: 50vh;
  }
</style>
