<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form :disabled="loading" @submit.prevent="handleSubmit(submit)">
      <vex-stack gap="32">
        <vex-block
          v-if="!autoCreateSecurityToken"
          :title="$t('module.fundraising.createForm.determineNumberOfTokens')"
          compact
        >
          <v-row>
            <v-col cols="6">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.fundraising.createForm.units')"
                :rules="{
                  required: true,
                  minMaxValue: {
                    min: MIN_TOKEN_UNITS_TO_SELL,
                    max: issuedTokens.amount
                  }
                }"
              >
                <v-text-field
                  v-model="formData.amount"
                  outlined
                  persistent-hint
                  :error-messages="errors"
                  :suffix="issuedTokens.assetId"
                  :hint="amountHint(formData.amount)"
                >
                  <template #message="{ message }">
                    <div class="text-caption" v-html="message" />
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
        </vex-block>

        <vex-block
          :title="$t('module.fundraising.createForm.selectDates')"
          compact
        >
          <v-row>
            <v-col cols="6">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.fundraising.createForm.startDate')"
                vid="startDate"
                rules="required|dateBefore:@endDate"
              >
                <vex-date-time-input
                  v-model="formData.startDate"
                  :error-messages="errors"
                  :label="$t('module.fundraising.createForm.startDate')"
                  only-future
                />
              </validation-provider>
            </v-col>
            <v-col cols="6">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.fundraising.createForm.endDate')"
                vid="endDate"
                rules="required|dateAfter:@startDate"
              >
                <vex-date-time-input
                  v-model="formData.endDate"
                  :error-messages="errors"
                  :label="$t('module.fundraising.createForm.endDate')"
                  only-future
                />
              </validation-provider>
            </v-col>
          </v-row>
        </vex-block>

        <vex-block
          :title="noHardCap
            ? $t('module.fundraising.createForm.selectAmount')
            : $t('module.fundraising.createForm.selectAmounts')"
          compact
        >
          <v-row>
            <v-col cols="6">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.fundraising.createForm.min')"
                vid="softCap"
                rules="assetSmaller:@hardCap"
              >
                <asset-input
                  v-model="formData.softCap"
                  :label="$t('module.fundraising.createForm.min')"
                  required
                  :assets-filter="capAssetsFilter"
                  :error-messages="errors"
                  @change="equalizeAsset"
                />
              </validation-provider>
            </v-col>
            <v-col v-if="!noHardCap" cols="6">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.fundraising.createForm.max')"
                vid="hardCap"
                rules="assetGreater:@softCap"
              >
                <asset-input
                  v-model="formData.hardCap"
                  :label="$t('module.fundraising.createForm.max')"
                  required
                  disable-assets
                  :gitassets-filter="capAssetsFilter"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>
        </vex-block>

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

  import { extend } from '@deip/validation-plugin';
  import { VexBlock, VexStack, VexDateTimeInput } from '@deip/vuetify-extended';
  import { AssetInput, assetsMixin } from '@deip/assets-module';
  import { hasValue } from '@deip/toolbox';
  import { proxydi } from '@deip/proxydi';
  import { MIN_TOKEN_UNITS_TO_SELL } from '@deip/constants';

  extend('assetSmaller', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;
      return parseFloat(value.amount) < parseFloat(target.amount);
    },
    message: (_, values) => {
      const i18n = proxydi.get('i18nInstance');
      return i18n.t('module.fundraising.createForm.validations.assetSmaller', values);
    }
  });

  extend('assetGreater', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;

      return parseFloat(value.amount) > parseFloat(target.amount);
    },
    message: (_, values) => {
      const i18n = proxydi.get('i18nInstance');
      return i18n.t('module.fundraising.createForm.validations.assetGreater', values);
    }
  });

  export default {
    name: 'CreateFundraisingForm',
    components: {
      AssetInput,
      VexBlock,
      VexStack,
      VexDateTimeInput
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
          amount: undefined,
          startDate: format(startDate, 'yyyy-MM-dd\'T\'HH:mm'),
          endDate: undefined,
          softCap: {},
          hardCap: {}
        },

        loading: false
      };
    },

    computed: {
      issuedTokens() {
        if (hasValue(this.project.securityTokens)) {
          return this.$$fromAssetUnits(this.project.securityTokens[0]);
        }

        return null;
      },

      availableTokens() {
        const teamBalance = this.$store.getters['balances/list']({
          owner: this.project.researchGroup.external_id,
          assetSymbol: this.issuedTokens.assetId
        });

        if (teamBalance.length > 0) {
          return this.$$fromAssetUnits(teamBalance[0].amount);
        }

        return null;
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

        const holders = [{
          account: this.project.researchGroup.external_id,
          amount: this.$$toAssetUnits({
            amount: DEFAULT_AMOUNT,
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
            researchExternalId: this.project.externalId,
            researchGroup: this.project.researchGroup.external_id,
            symbol: assetId,
            precision: DEFAULT_PRECISION,
            description: '',
            maxSupply: parseInt(DEFAULT_AMOUNT + '0'.repeat(DEFAULT_PRECISION), 10),
            holders
          }
        ];

        return this.$store.dispatch('assets/createProjectSecurityToken', data)
          .then(() => this.$store.dispatch('assets/getBySymbol', assetId))
          .then(() => assetId);
      },

      createFundraising(securityTokensOnSale) {
        if (this.noHardCap) {
          this.formData.hardCap = { ...this.formData.softCap };
        }

        const payload = {
          user: this.$currentUser,
          data: {
            teamId: this.project.researchGroup.external_id,
            projectId: this.project.externalId,
            startTime: this.formatDate(this.formData.startDate),
            endTime: this.formatDate(this.formData.endDate),
            securityTokensOnSale,
            softCap: this.$$toAssetUnits(this.formData.softCap, false),
            hardCap: this.$$toAssetUnits(this.formData.hardCap, false)
          },
          proposalInfo: {
            isProposal: this.isProposal
          }
        };

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
              const securityTokensOnSale = [
                this.$$toAssetUnits({
                  amount: currentSupply,
                  assetId,
                  precision
                }, false)
              ];
              this.createFundraising(securityTokensOnSale);
            });
        } else {
          const securityTokensOnSale = [
            this.$$toAssetUnits({
              ...this.issuedTokens,
              amount: this.formData.amount
            }, false)
          ];
          this.createFundraising(securityTokensOnSale);
        }
      },

      amountHint(val) {
        if (!val) return '';

        const messages = [
          `${this.toPercent(val)} of ${this.$$toAssetUnits(this.issuedTokens)} issued tokens`
        ];
        if (this.issuedTokens.amount > this.availableTokens.amount) {
          messages.push(
            `${this.toPercent(val, this.availableTokens)} of ${this.$$toAssetUnits(this.availableTokens)} team's tokens`
          );
        }

        return messages.join('<br>');
      },

      toPercent(val, from) {
        if (!val) return '';
        const target = from || this.issuedTokens;
        const pc = (val / target.amount) * 100;

        return `${Math.round(pc * 100) / 100}%`;
      },

      equalizeAsset() {
        this.formData.hardCap = {
          ...this.formData.hardCap,
          assetId: this.formData.softCap.assetId,
          precision: this.formData.softCap.precision
        };
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
  };
</script>
