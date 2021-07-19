<template>
  <v-row>
    <v-col
      v-for="(balance, index) of balances"
      :key="balance.assetId"
      cols="12"
      sm="6"
      md="4"
    >
      <balance-card
        :balance="balance"
        :background-color="colorsPallete[index].background"
        :with-deposit="withDeposit"
        @deposit="handleDeposit"
      />
    </v-col>
  </v-row>
</template>

<script>
  import { genColorsPalette } from '@deip/toolbox';

  import BalanceCard from './BalanceCard';

  export default {
    name: 'BalancesCards',

    components: {
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
