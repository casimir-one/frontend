<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form :disabled="loading" @submit.prevent="handleSubmit(confirmSubmit)">
      <ve-stack :gap="32">
        <slot name="header" />
        <v-divider />

        <fundraising-progress
          :token-sale="tokenSale"
        />

        <ve-stack :gap="24">
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
              :asset="hardCap.symbol"
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
                  <a :href="tosUrl" target="_blank" @click.stop>
                    {{ $t('module.fundraising.contributeForm.tos') }}
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
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { VeStack } from '@deip/vue-elements';
  import FundraisingProgress from '../Progress/FundraisingProgress';
  import AmountSelector from './AmountSelector';

  export default {
    name: 'ContributeForm',

    components: {
      VeStack,
      FundraisingProgress,
      AmountSelector
    },

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
          assetToContribute: null
        }
      };
    },

    computed: {
      hardCap() {
        return this.tokenSale?.hardCap
          ? {
            ...this.tokenSale.hardCap,
            amount: parseInt(this.tokenSale.hardCap.amount)
          }
          : {};
      },

      collected() {
        return this.tokenSale?.totalInvested ? {
          ...this.tokenSale.totalInvested,
          amount: parseInt(this.tokenSale.totalInvested.amount)
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
        this.formData.assetToContribute = {
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
          this.$notifier.showError(this.$t('module.fundraising.contributeForm.userBalanceIsNotEnough'));
          return;
        }
        const message = this.$t('module.fundraising.contributeForm.doYouConfirm');
        const options = { title: this.$t('module.fundraising.contributeForm.confirmTitle') };

        const isConfirmed = await this.$confirm(message, options);
        if (isConfirmed) {
          this.loading = true;

          this.contribute();

          this.loading = false;
        }
      },

      async contribute() {
        const payload = {
          user: this.$currentUser,
          data: {
            investmentOpportunityId: this.tokenSale._id,
            investor: this.$currentUser._id,
            asset: this.formData.assetToContribute
          }
        };

        try {
          await this.$store.dispatch('fundraising/contribute', payload);
          this.emitSuccess();
        } catch (error) {
          this.emitError(error);
        }
      }
    }
  };
</script>
