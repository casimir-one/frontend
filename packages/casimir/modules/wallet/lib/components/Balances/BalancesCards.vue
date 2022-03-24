<template>
  <ve-auto-grid item-width="272px">
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
  /**
   * Сomponent displays a list of cards of all available balances
   */
  export default {
    name: 'BalancesCards',

    components: {
      VeAutoGrid,
      BalanceCard
    },

    props: {
      /**
       * Balance list
       */
      balances: {
        type: Array,
        default() { return []; }
      },
      /**
       * Сan the user make a deposit
       * default: true
       */
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
      /**
       * Open deposit popup
       * Fires when the user clicks on the deposit button
       * @property {Object} e - balance data
       * @event deposit
       */
      handleDeposit(e) {
        this.$emit('deposit', e);
      }
    }
  };
</script>
