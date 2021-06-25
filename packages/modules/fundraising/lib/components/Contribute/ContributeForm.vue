<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form :disabled="loading" @submit.prevent="handleSubmit(confirmSubmit)">
      <vex-stack gutter="32">
        <slot name="header" />
        <v-divider />

        <fundraising-progress
          :token-sale="tokenSale"
        />

        <vex-stack gutter="24">
          <v-divider />
          <h4 class="text-h4">
            {{ $t('module.fundraising.contributeForm.title') }}
          </h4>

          <validation-provider
            :name="$t('module.fundraising.contributeForm.amount')"
            :rules="{
              required: true,
              number: true,
              minMaxValue: {
                min: 1,
                max: remainingAmount
              }
            }"
          >
            <amount-selector
              v-model="internalAmount"
              :goal-amount="hardCap.amount"
              :remaining-amount="remainingAmount"
              :asset="assetId"
              :disabled="loading"
            />
          </validation-provider>

          <validation-provider
            name="Agreement"
            :rules="{ required: { allowFalse: false } }"
          >
            <v-checkbox
              v-model="formData.agreeFundraising"
              class="align-start"
              hide-details
            >
              <template #label>
                <i18n path="module.fundraising.contributeForm.agree" class="text-body-2">
                  <a :href="tosUrl" target="_blank">
                    {{ $t('module.fundraising.contributeForm.tos') }}
                  </a>
                </i18n>
              </template>
            </v-checkbox>
          </validation-provider>
        </vex-stack>

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="button"
            text
            color="primary"
            :disabled="loading"
            @click="handleCancelClick"
          >
            {{ $t('module.fundraising.contributeForm.cancel') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            class="ml-2"
            :loading="loading"
            :disabled="invalid || loading"
          >
            {{ $t('module.fundraising.contributeForm.invest') }}
          </v-btn>
        </div>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { assetsMixin } from '@deip/assets-module';
  import { VexStack } from '@deip/vuetify-extended';
  import FundraisingProgress from '../Progress/FundraisingProgress';
  import AmountSelector from './AmountSelector';

  export default {
    name: 'ContributeForm',

    components: {
      VexStack,
      FundraisingProgress,
      AmountSelector
    },

    mixins: [assetsMixin],

    props: {
      tokenSale: {
        type: Object,
        required: true
      },
      tosUrl: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        loading: false,
        internalAmount: null,
        formData: {
          agreeFundraising: false,
          amountToContribute: ''
        }
      };
    },

    computed: {
      hardCap() {
        return this.$$fromAssetUnits(this.tokenSale.hardCap);
      },

      collected() {
        return this.$$fromAssetUnits(this.tokenSale.totalAmount);
      },

      remainingAmount() {
        return this.hardCap.amount - this.collected.amount;
      },

      assetId() {
        return this.hardCap.assetId;
      },

      isUserBalanceEnough() {
        const userBalance = this.$store.getters['currentUserBalances/one'](this.assetId);
        if (!userBalance) return false;

        const userBalanceAmount = this.$$fromAssetUnits(userBalance.amount).amount;
        return (this.internalAmount || 0) <= userBalanceAmount;
      }
    },

    watch: {
      internalAmount(val) {
        this.formData.amountToContribute = this.$$toAssetUnits({
          amount: val,
          assetId: this.hardCap.assetId,
          precision: this.hardCap.precision
        }, false);
      }
    },

    methods: {
      handleCancelClick() {
        this.$emit('cancel');
      },

      confirmSubmit() {
        if (!this.isUserBalanceEnough) {
          this.$notifier.showError(this.$t('module.fundraising.contributeForm.userBalanceIsNotEnough'));
          return;
        }

        const message = this.$t('module.fundraising.contributeForm.doYouConfirm');
        const options = { title: this.$t('module.fundraising.contributeForm.confirmTitle') };
        this.$confirm(message, options)
          .then((isConfirmed) => {
            if (isConfirmed) {
              this.contribute();
            }
          });
      },

      contribute() {
        this.loading = true;

        this.$store.dispatch('fundraising/contribute', {
          user: this.$currentUser,
          data: {
            tokenSaleId: this.tokenSale.externalId,
            contributor: this.$currentUser.username,
            amount: this.formData.amountToContribute
          }
        })
          .then(() => {
            this.$emit('success');
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
