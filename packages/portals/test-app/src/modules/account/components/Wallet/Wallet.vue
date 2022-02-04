<template>
  <ve-stack :gap="8">
    <vex-section>
      <balances
        @payment-processed="handlePaymentProcessed"
      />
    </vex-section>

    <v-divider />

    <payment-history />
  </ve-stack>
</template>

<script>
  import { Balances } from '@deip/wallet-module';
  import { VexSection } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import PaymentHistory from './PaymentHistory';

  export default {
    name: 'Wallet',

    components: {
      VexSection,
      VeStack,
      Balances,
      PaymentHistory
    },

    methods: {
      handlePaymentProcessed() {
        this.$store.dispatch('wallet/getHistory', { account: this.$currentUser._id });
      }
    }
  };
</script>
