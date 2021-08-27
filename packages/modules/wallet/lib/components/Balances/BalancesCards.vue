<template>
  <ve-auto-grid>
    <balance-card
      v-for="(balance, index) of balances"
      :key="balance.assetId"
      :balance="balance"
      :background-color="colorsPallete[index].background"
      :with-deposit="withDeposit"
      @deposit="handleDeposit"
    />
  </ve-auto-grid>
</template>

<script>
  import { genColorsPalette } from '@deip/toolbox';
  import { VeAutoGrid } from '@deip/vue-elements';
  import BalanceCard from './BalanceCard';

  export default {
    name: 'BalancesCards',

    components: {
      VeAutoGrid,
      BalanceCard
    },

    props: {
      balances: {
        type: Array,
        default() { return []; }
      },
      withDeposit: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      colorsPallete() {
        return genColorsPalette({ colorsCount: this.balances.length, palette: ['#5473E9', '#77C8BE'] });
      }
    },

    methods: {
      handleDeposit(e) {
        this.$emit('deposit', e);
      }
    }
  };
</script>
