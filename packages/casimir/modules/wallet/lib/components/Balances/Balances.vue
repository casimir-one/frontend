<template>
  <ve-stack :gap="32">
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
      @payment-processed="handlePaymentProcessed"
    />
  </ve-stack>
</template>

<script>
  import { ASSET_TYPE } from '@deip/constants';
  import { VexDialog } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { componentViewType } from '@deip/platform-util';
  import { AssetInput } from '@deip/assets-module';

  import BalancesCards from './BalancesCards';
  import DepositDialog from './DepositDialog';

  export default {
    name: 'Balances',

    components: {
      VeStack,
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
        const assets = this.$store.getters['assets/list'](
          { type: [ASSET_TYPE.COIN, ASSET_TYPE.CORE] }
        );

        if (!assets.length) return this.$store.getters['wallet/list']();

        return assets.map((asset) => {
          const walletBalance = this.$store.getters['wallet/one'](asset.symbol);

          return {
            amount: '0',
            assetId: asset.assetId,
            precision: asset.precision,
            symbol: asset.symbol,
            type: asset.type,
            owner: this.$currentUser._id,
            ...walletBalance
          };
        });
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
      },
      handlePaymentProcessed() {
        this.$store.dispatch('wallet/get');
        this.$emit('payment-processed');
      }
    }
  };
</script>
