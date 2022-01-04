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
        <vex-stack class="white--text">
          <div>
            <v-chip
              small
              outlined
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
        </vex-stack>
      </v-card>
    </ve-shadow-box>
  </v-hover>
</template>

<script>
  import { ASSET_TYPE } from '@deip/constants';
  import { VexStack } from '@deip/vuetify-extended';
  import { VeShadowBox } from '@deip/vue-elements';
  import { currency } from '@deip/assets-module';

  export default {
    name: 'BalanceCard',

    components: {
      VeShadowBox,
      VexStack
    },

    props: {
      balance: {
        type: Object,
        required: true
      },
      withDeposit: {
        type: Boolean,
        default: true
      },
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
      handleDepositClick() {
        this.$emit('deposit', this.balance);
      }
    }
  };
</script>
