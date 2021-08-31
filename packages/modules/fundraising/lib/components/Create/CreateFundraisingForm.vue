<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form :disabled="loading" @submit.prevent="handleSubmit(submit)">
      <vex-stack gap="32">
        <fundraising-title-input v-model="formData.title" />

        <fundraising-tokens-input
          v-if="!autoCreateSecurityToken"
          v-model="formData.tokens"
          :issued-tokens="issuedTokens"
          :available-tokens="availableTokens"
        />

        <fundraising-dates-input v-model="formData.dates" />

        <fundraising-isa-input
          v-if="isaFundraise"
          v-model="formData.isa"
          :cap-assets-filter="capAssetsFilter"
        />

        <fundraising-caps-input
          v-else
          v-model="formData.caps"
          :no-hard-cap="noHardCap"
          :cap-assets-filter="capAssetsFilter"
        />

        <v-divider />

        <div class="d-flex align-center">
          <v-spacer />
          <vex-stack horizontal gap="8">
            <v-btn
              type="button"
              text
              color="primary"
              :disabled="loading"
              @click="handleCancelClick"
            >
              {{ $t('module.fundraising.createForm.cancel') }}
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              class="ml-2"
              :loading="loading"
              :disabled="invalid || loading"
            >
              {{ $t('module.fundraising.createForm.start') }}
            </v-btn>
          </vex-stack>
        </div>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import {
    getMinutes,
    setMinutes,
    addMinutes,
    format
  } from 'date-fns';
  import randomstring from 'randomstring';

  import { defineComponent } from '@deip/platform-util';
  import { VexStack } from '@deip/vuetify-extended';
  import { assetsMixin } from '@deip/assets-module';
  import { hasValue } from '@deip/toolbox';
  import { isNil } from '@deip/toolbox/lodash';
  import { MIN_TOKEN_UNITS_TO_SELL } from '@deip/constants';

  import FundraisingTitleInput from './FundraisingTitleInput';
  import FundraisingTokensInput from './FundraisingTokensInput';
  import FundraisingDatesInput from './FundraisingDatesInput';
  import FundraisingCapsInput from './FundraisingCapsInput';
  import FundraisingIsaInput from './FundraisingIsaInput';

  export default defineComponent({
    name: 'CreateFundraisingForm',
    components: {
      VexStack,
      FundraisingTitleInput,
      FundraisingTokensInput,
      FundraisingDatesInput,
      FundraisingCapsInput,
      FundraisingIsaInput
    },

    mixins: [assetsMixin],

    props: {
      project: {
        type: Object,
        required: true
      },
      autoCreateSecurityToken: {
        type: Boolean,
        default: false
      },
      isaFundraise: {
        type: Boolean,
        default: false
      },
      noHardCap: {
        type: Boolean,
        default: false
      },
      capAssetsFilter: {
        type: Object,
        default() { return {}; }
      },
      isProposal: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const currentDate = new Date();
      const roundedMinutes = Math.round(getMinutes(currentDate) / 5) * 5;
      let startDate = setMinutes(currentDate, roundedMinutes);
      startDate = addMinutes(startDate, 10);

      return {
        MIN_TOKEN_UNITS_TO_SELL,

        formData: {
          title: null,
          tokens: undefined,
          dates: {
            start: format(startDate, 'yyyy-MM-dd\'T\'HH:mm'),
            end: undefined
          },
          caps: {
            soft: {},
            hard: {}
          },
          isa: {}
        },

        loading: false
      };
    },

    computed: {
      issuedTokens() {
        if (hasValue(this.project.securityTokens)) {
          const lastIndex = this.project.securityTokens.length - 1;
          return this.$$fromAssetUnits(this.project.securityTokens[lastIndex]);
        }

        return null;
      },

      availableTokens() {
        const teamBalance = this.$store.getters['balances/list']({
          owner: this.project.researchGroup.external_id,
          assetSymbol: this.issuedTokens?.assetId
        });

        if (teamBalance.length > 0) {
          return this.$$fromAssetUnits(teamBalance[0].amount);
        }

        return null;
      }
    },

    watch: {
      'formData.isa': {
        handler(value) {
          if (isNil(value.amountPerItem) || isNil(value.quantity)) return;

          const cap = {
            ...value.amountPerItem,
            amount: value.amountPerItem.amount * parseInt(value.quantity, 10)
          };
          this.formData.caps.soft = cap;
          this.formData.caps.hard = cap;
        }
      }
    },

    methods: {
      formatDate(val) {
        return new Date(val).toISOString()
          .split('.')[0];
      },

      createSecurityToken() {
        const DEFAULT_PRECISION = 0;
        const DEFAULT_AMOUNT = 10000;
        const assetId = this.generateAssetSymbol();
        const amount = this.isaFundraise
          ? parseInt(this.formData.isa.quantity, 10) * DEFAULT_AMOUNT
          : DEFAULT_AMOUNT;

        const holders = [{
          account: this.project.researchGroup.external_id,
          amount: this.$$toAssetUnits({
            amount,
            assetId,
            precision: DEFAULT_PRECISION
          }, false)
        }];

        const data = [
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          {
            issuer: this.project.researchGroup.external_id,
            symbol: assetId,
            precision: DEFAULT_PRECISION,
            maxSupply: parseInt(amount + '0'.repeat(DEFAULT_PRECISION), 10),
            description: '',
            projectTokenOption: {
              projectId: this.project.externalId,
              teamId: this.project.researchGroup.external_id,
              licenseRevenue: {
                holdersShare: '100.00 %'
              }
            },
            holders
          }
        ];

        return this.$store.dispatch('assets/createProjectSecurityToken', data)
          .then(() => this.$store.dispatch('assets/getBySymbol', assetId))
          .then(() => assetId);
      },

      createFundraising(shares) {
        const payload = {
          user: this.$currentUser,
          data: {
            title: this.formData.title,
            teamId: this.project.researchGroup.external_id,
            projectId: this.project.externalId,
            startTime: this.formatDate(this.formData.dates.start),
            endTime: this.formatDate(this.formData.dates.end),
            shares,
            softCap: this.$$toAssetUnits(this.formData.caps.soft, false),
            hardCap: this.$$toAssetUnits(this.formData.caps.hard, false)
          },
          proposalInfo: {
            isProposal: this.isProposal
          }
        };

        if (this.isaFundraise) {
          payload.data.metadata = {
            isa: {
              amountPerItem: this.$$toAssetUnits(this.formData.isa.amountPerItem, false),
              quantity: parseInt(this.formData.isa.quantity, 10)
            }
          };
        }

        this.$store.dispatch('fundraising/create', payload)
          .then(() => {
            this.$emit('success');
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      submit() {
        this.loading = true;

        if (this.autoCreateSecurityToken) {
          this.createSecurityToken()
            .then((assetId) => {
              const { currentSupply, precision } = this.$store.getters['assets/one'](assetId);
              const shares = [
                this.$$toAssetUnits({
                  amount: currentSupply,
                  assetId,
                  precision
                }, false)
              ];
              this.createFundraising(shares);
            });
        } else {
          const shares = [
            this.$$toAssetUnits({
              ...this.issuedTokens,
              amount: this.formData.tokens
            }, false)
          ];
          this.createFundraising(shares);
        }
      },

      generateAssetSymbol() {
        const existingSymbols = this.$store.getters['assets/listKeys']();

        let result = null;
        while (!result) {
          const res = randomstring.generate({
            length: 5,
            charset: 'alphabetic',
            capitalization: 'uppercase'
          });

          if (!existingSymbols.includes(res)) {
            result = res;
          }
        }

        return result;
      },

      handleCancelClick() {
        this.$emit('cancel');
      }
    }
  });
</script>
