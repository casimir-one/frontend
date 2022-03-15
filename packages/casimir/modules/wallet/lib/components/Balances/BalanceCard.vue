<template>
  <v-hover v-slot="{ hover }">
    <ve-shadow-box :opacity="hover ? 1 : 0">
      <v-card
        :elevation="hover ? 8 : 0"
        :style="styles"
        flat
        height="184px"
        class="pa-6"
      >
        <ve-stack class="white--text">
          <div>
            <v-chip
              small
              readonly
              color="white"
            >
              {{ balance.symbol }}
            </v-chip>
            <span class="text-overline ml-3">{{ $t('module.wallet.balances.balance') }}</span>
          </div>

          <div
            class="text-h2 text-truncate"
            :title="formattedAmount"
          >
            {{ formattedAmount }}
          </div>

          <div>
            <v-btn
              v-if="withDeposit && balance.type !== ASSET_TYPE.CORE"
              x-small
              text
              depressed
              plain
              :ripple="false"
              color="white"
              class="pa-0 text-body-2 font-weight-medium"
              @click="handleDepositClick"
            >
              <v-icon class="mr-2">
                mdi-arrow-up-circle
              </v-icon>
              {{ $t('module.wallet.balances.deposit') }}
            </v-btn>
          </div>
        </ve-stack>
      </v-card>
    </ve-shadow-box>
  </v-hover>
</template>

<script>
  import { ASSET_TYPE } from '@deip/constants';
  import { VeShadowBox, VeStack } from '@deip/vue-elements';
  import { currency } from '@deip/assets-module';
  /**
  * Сomponent for displaying a balance card for a specific currency
  */
  export default {
    name: 'BalanceCard',

    components: {
      VeShadowBox,
      VeStack
    },

    props: {
      /**
       * Balance
       * @example {
       *  amount: string,    - the amount of money in the balance
       *  precision: number, - a number of simbols after comma
       *  symbol: string,    - short currency symbol USD,EUR, etc.
       *  type: number,      - currency type: COIN - 1, NFT - 2, CORE - 3
       * }
       *
       */
      balance: {
        type: Object,
        required: true
      },
      /**
       * Сan the user make a deposit
       * default: true
       */
      withDeposit: {
        type: Boolean,
        default: true
      },
      /**
       * Balance card color
       */
      backgroundColor: {
        type: String,
        default: '#4CB0D1'
      }
    },

    data() {
      return {
        ASSET_TYPE
      };
    },

    computed: {
      styles() {
        return {
          backgroundBlendMode: 'overlay, normal',
          background: `linear-gradient(280deg, rgba(255, 255, 255, 0.7) 0.08%, rgba(255, 255, 255, 0) 100%), ${this.backgroundColor}`
        };
      },

      formattedAmount() {
        return currency(
          this.balance.amount,
          {
            precision: this.balance.precision,
            symbol: '',
            separator: ',',
            pattern: '#!',
            negativePattern: '-#!'
          }
        ).format();
      }
    },

    methods: {
      /**
       * Open deposit popup
       * Fires when the user clicks on the deposit button
       * @event deposit
       */
      handleDepositClick() {
        this.$emit('deposit', this.balance);
      }
    }
  };
</script>
