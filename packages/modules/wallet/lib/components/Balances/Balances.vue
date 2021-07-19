<template>
  <vex-stack gutter="32">
    <div class="d-flex justify-space-between align-center">
      <span class="text-h3">
        {{ $t('module.wallet.balances.wallet') }}
      </span>
      <v-btn
        color="primary"
        small
        @click.stop="handleDeposit()"
      >
        {{ $t('module.wallet.balances.deposit') }}
      </v-btn>
    </div>

    <component
      :is="listComponent"
      :balances="balances"
      :with-deposit="withDeposit"
      v-on="componentEvents"
    />

    <deposit-dialog
      v-model="isDialogOpened"
      :asset-balance="selectedAssetBalance"
    />
  </vex-stack>
</template>

<script>
  import { VexStack, VexDialog } from '@deip/vuetify-extended';
  import { componentViewType } from '@deip/platform-util';
  import { AssetInput } from '@deip/assets-module';

  import BalancesCards from './BalancesCards';
  import DepositDialog from './DepositDialog';

  export default {
    name: 'Balances',

    components: {
      VexStack,
      VexDialog,
      AssetInput,
      BalancesCards,
      DepositDialog
    },

    props: {
      viewType: {
        type: String,
        default: 'cards'
      },
      withDeposit: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        isDialogOpened: false,
        selectedAssetBalance: null
      };
    },

    computed: {
      balances() {
        return this.$store.getters['wallet/list']();
      },

      listComponent() {
        return componentViewType.call(this);
      },

      componentEvents() {
        return {
          ...(this.withDeposit ? { deposit: this.handleDeposit } : {})
        };
      }
    },

    methods: {
      handleDeposit(balance) {
        this.selectedAssetBalance = balance;
        this.isDialogOpened = true;
      }
    }
  };
</script>
