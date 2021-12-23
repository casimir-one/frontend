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
      // TODO rethink logic, maybe security token should be passed in props;
      // select asset for fundraising from team assets that weren't sold
      issuedTokens() {
        if (hasValue(this.project.nfts)) {
          return this.project.nfts[0];
        }

        return null;
      },

      availableTokens() {
        const teamBalance = this.$store.getters['balances/list']({
          owner: this.project.teamId,
          symbol: this.issuedTokens?.symbol
        });

        if (teamBalance.length > 0) {
          return teamBalance[0];
        }

        return null;
      }
    },

    watch: {
      'formData.isa': {
        handler(value) {
          if (isNil(value.assetPerItem)) return;

          const cap = {
            ...value.assetPerItem,
            amount: (value.assetPerItem.amount || 0) * (parseInt(value.quantity) || 0)
          };
          this.formData.caps.soft = cap;
          this.formData.caps.hard = cap;
        }
      }
    },

    methods: {
      convertDateToTimestamp(val) {
        return new Date(val).getTime();
      },

      createSecurityToken() {
        const DEFAULT_PRECISION = 0;
        const DEFAULT_AMOUNT = '10000';
        const symbol = this.generateAssetSymbol();
        const amount = this.isaFundraise
          ? parseInt(this.formData.isa.quantity) * DEFAULT_AMOUNT
          : DEFAULT_AMOUNT;

        const holders = [{
          account: this.project.teamId,
          asset: {
            amount: amount.toString(),
            symbol,
            precision: DEFAULT_PRECISION
          }
        }];

        const data = {
          user: this.$currentUser,
          data: {
            issuer: this.project.teamId,
            symbol,
            precision: DEFAULT_PRECISION,
            maxSupply: parseInt(amount),
            description: '',
            projectTokenOption: {
              projectId: this.project._id,
              teamId: this.project.teamId,
              licenseRevenue: {
                holdersShare: '100.00 %'
              }
            },
            holders
          }
        };

        return this.$store.dispatch('assets/create', data)
          .then(() => this.$store.dispatch('assets/getBySymbol', symbol))
          .then(() => symbol);
      },

      createFundraising(shares) {
        const payload = {
          user: this.$currentUser,
          data: {
            title: this.formData.title,
            teamId: this.project.teamId,
            projectId: this.project._id,
            startTime: this.convertDateToTimestamp(this.formData.dates.start),
            endTime: this.convertDateToTimestamp(this.formData.dates.end),
            shares,
            softCap: this.formData.caps.soft,
            hardCap: this.formData.caps.hard
          },
          proposalInfo: {
            isProposal: this.isProposal
          }
        };

        if (this.isaFundraise) {
          payload.data.metadata = {
            isa: {
              assetPerItem: this.formData.isa.assetPerItem,
              quantity: parseInt(this.formData.isa.quantity)
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
            .then((symbol) => {
              const { _id, currentSupply, precision } = this.$store.getters['assets/one'](symbol);
              const shares = [{
                id: _id,
                amount: currentSupply,
                symbol,
                precision
              }];
              this.createFundraising(shares);
            });
        } else {
          const shares = [{
            id: this.issuedTokens.assetId,
            symbol: this.issuedTokens.symbol,
            precision: this.issuedTokens.precision,
            amount: this.formData.tokens
          }];
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
