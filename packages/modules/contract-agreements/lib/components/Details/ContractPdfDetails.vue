<template>
  <vex-stack v-if="!loading">
    <pdf src="" />

    <template v-if="canDiscard || canSign">
      <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
        <v-form
          :disabled="signLoading"
          @submit.prevent="handleSubmit(handleSignContract)"
        >
          <vex-stack :gutter="32">
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

              <vex-stack
                :gutter="16"
                horizontal
              >
                <v-btn
                  v-if="canDiscard"
                  type="button"
                  :text="canSign"
                  color="error"
                  depressed
                  :loading="discardLoading"
                  @click="handleDiscardContract"
                >
                  {{ $t('module.contractAgreements.discard') }}
                </v-btn>

                <v-btn
                  v-if="canSign"
                  type="submit"
                  color="primary"
                  depressed
                  :disabled="invalid"
                  :loading="signLoading"
                >
                  {{ $t('module.contractAgreements.details.sign') }}
                </v-btn>
              </vex-stack>
            </div>
          </vex-stack>
        </v-form>
      </validation-observer>
    </template>
  </vex-stack>
</template>

<script>
  import pdf from 'vue-pdf';

  import { VexStack } from '@deip/vuetify-extended';

  export default {
    name: 'ContractPdfDetails',

    components: {
      pdf,
      VexStack
    },

    props: {
      contractId: {
        type: String,
        default: null
      },
      currentPartyId: {
        type: String,
        default: null
      },
      canSign: {
        type: Boolean,
        default: false
      },
      canDiscard: {
        type: Boolean,
        default: false
      },
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
        signLoading: false
      };
    },

    computed: {
      contract() {
        return this.$store.getters['contractAgreements/one'](this.contractId);
      }
    },

    created() {
      this.loading = true;
      this.getContract()
        .then(() => {
          this.$emit('contract-loaded', this.contract);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    methods: {
      getContract() {
        return this.$store.dispatch('contractAgreements/getOne', this.contractId);
      },

      handleDiscardContract() {
        this.$confirm(this.$t('module.contractAgreements.discardAction.confirm.message'),
                      { title: this.$t('module.contractAgreements.discardAction.confirm.title') })
          .then((confirm) => {
            if (confirm) {
              this.discardLoading = true;
              const payload = {
                initiator: this.$currentUser,
                data: {
                  account: this.currentPartyId,
                  proposalId: this.contract.proposalId
                }
              };
              this.$store.dispatch('contractAgreements/discard', payload)
                .then(() => this.getContract())
                .then(() => {
                  this.$notifier.showSuccess(this.$t('module.contractAgreements.discardAction.success'));
                })
                .finally(() => {
                  this.discardLoading = false;
                })
                .catch((error) => {
                  console.error(error);
                  this.$notifier.showError(error.message);
                });
            }
          });
      },

      handleSignContract() {
        this.$confirm(this.$t('module.contractAgreements.signAction.confirm.message'),
                      { title: this.$t('module.contractAgreements.signAction.confirm.title') })
          .then((confirm) => {
            if (confirm) {
              this.signLoading = true;
              const payload = {
                initiator: this.$currentUser,
                data: {
                  contractParty: this.currentPartyId,
                  proposalId: this.contract.proposalId
                }
              };
              this.$store.dispatch('contractAgreements/acceptProposed', payload)
                .then(() => this.getContract())
                .then(() => {
                  this.$notifier.showSuccess(this.$t('module.contractAgreements.signAction.success'));
                })
                .finally(() => {
                  this.signLoading = false;
                })
                .catch((error) => {
                  console.error(error);
                  this.$notifier.showError(error.message);
                });
            }
          });
      }
    }
  };
</script>
