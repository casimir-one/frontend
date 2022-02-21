<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form :disabled="loading" @submit.prevent="handleSubmit(confirmSubmit)">
      <ve-stack :gap="32">
        <slot name="header" />
        <v-divider />
        <crowdfunding-progress
          :investment-opportunity="investmentOpportunity"
        />

        <ve-stack :gap="24">
          <v-divider />
          <h4 class="text-h4">
            {{ $t('module.crowdfunding.investForm.title') }}
          </h4>

          <validation-provider
            :name="$t('module.crowdfunding.investForm.amount')"
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
              :asset="hardCap.symbol"
              :disabled="loading"
            />
          </validation-provider>

          <validation-provider
            name="Agreement"
            :rules="{ required: { allowFalse: false } }"
          >
            <v-checkbox
              v-model="formData.agreeCrowdfunding"
              class="align-start"
              hide-details
            >
              <template #label>
                <i18n path="module.crowdfunding.investForm.agree" class="text-body-2">
                  <a :href="tosUrl" target="_blank" @click.stop>
                    {{ $t('module.crowdfunding.investForm.tos') }}
                  </a>
                </i18n>
              </template>
            </v-checkbox>
          </validation-provider>
        </ve-stack>

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
            {{ $t('module.crowdfunding.investForm.cancel') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            class="ml-2"
            :loading="loading"
            :disabled="invalid || loading"
          >
            {{ $t('module.crowdfunding.investForm.invest') }}
          </v-btn>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { VeStack } from '@deip/vue-elements';
  import CrowdfundingProgress from '../Progress/CrowdfundingProgress';
  import AmountSelector from './AmountSelector';

  export default {
    name: 'InvestForm',

    components: {
      VeStack,
      CrowdfundingProgress,
      AmountSelector
    },

    props: {
      investmentOpportunity: {
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
          agreeCrowdfunding: false,
          assetToInvest: null
        }
      };
    },

    computed: {
      hardCap() {
        return this.investmentOpportunity?.hardCap
          ? {
            ...this.investmentOpportunity.hardCap,
            amount: parseInt(this.investmentOpportunity.hardCap.amount)
          }
          : {};
      },

      collected() {
        return this.investmentOpportunity?.totalInvested ? {
          ...this.investmentOpportunity.totalInvested,
          amount: parseInt(this.investmentOpportunity.totalInvested.amount)
        }
          : {};
      },

      remainingAmount() {
        return this.hardCap.amount - this.collected.amount;
      },

      isUserBalanceEnough() {
        const userBalance = this.$store.getters['wallet/one'](this.hardCap.symbol);
        if (!userBalance) return false;

        const userBalanceAmount = parseInt(userBalance?.amount);
        return (this.internalAmount || 0) <= userBalanceAmount;
      }
    },

    watch: {
      internalAmount(val) {
        this.formData.assetToInvest = {
          amount: val ? val.toString() : null,
          id: this.hardCap.id,
          symbol: this.hardCap.symbol,
          precision: this.hardCap.precision
        };
      }
    },

    methods: {
      handleCancelClick() {
        this.$emit('cancel');
      },

      emitSuccess() {
        this.$emit('success');
      },
      emitError(error) {
        this.$emit('error', error);
      },

      async confirmSubmit() {
        if (!this.isUserBalanceEnough) {
          this.$notifier.showError(this.$t('module.crowdfunding.investForm.userBalanceIsNotEnough'));
          return;
        }
        const message = this.$t('module.crowdfunding.investForm.doYouConfirm');
        const options = { title: this.$t('module.crowdfunding.investForm.confirmTitle') };

        const isConfirmed = await this.$confirm(message, options);
        if (isConfirmed) {
          this.loading = true;

          await this.invest();

          this.loading = false;
        }
      },

      async invest() {
        const payload = {
          initiator: this.$currentUser,
          data: {
            investmentOpportunityId: this.investmentOpportunity._id,
            investor: this.$currentUser._id,
            asset: this.formData.assetToInvest
          }
        };

        try {
          await this.$store.dispatch('investmentOpportunities/invest', payload);
          this.emitSuccess();
        } catch (error) {
          this.emitError(error);
        }
      }
    }
  };
</script>
