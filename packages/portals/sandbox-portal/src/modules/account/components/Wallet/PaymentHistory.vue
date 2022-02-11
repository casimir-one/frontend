<template>
  <!-- <v-data-iterator-custom
    :items="paymentHistory"
    :title="$t('account.wallet.paymentHistory.title')"
    :title-badge="false"
    :loading="loading"
  > -->
  <!-- <template #default="{ items }"> -->

  <v-data-table
    :items="paymentHistory"
    :headers="headers"
    :items-per-page="10"
  >
    <template #item.currency="{ item }">
      <v-chip outlined>
        <v-icon
          left
          :size="20"
          class="text--disabled"
        >
          mdi-arrow-up-circle
        </v-icon>
        {{ item.currency }}
      </v-chip>
    </template>

    <template #item.date="{ item }">
      <span class="text-body-2 font-weight-medium">
        {{ formatDate(item.date) }}
      </span>
    </template>

    <template #item.amount="{ item }">
      {{ formatAmount(item.amount, item.currency) }}
    </template>

    <template #item.status="{ item }">
      <v-chip
        outlined
        :color="getColorByDepositStatus(item.status)"
      >
        {{ formatStatus(item.status) }}
      </v-chip>
    </template>
  </v-data-table>
  <!-- </template> -->
  <!-- </v-data-iterator-custom> -->
</template>

<script>
  import { assetsMixin } from '@deip/assets-module';
  import { dateMixin } from '@deip/platform-components';
  import { DEPOSIT_REQUEST_STATUS } from '@deip/constants';
  import { orderBy } from '@deip/toolbox/lodash';

  const colorByDepositStatus = {
    [DEPOSIT_REQUEST_STATUS.PENDING]: 'info',
    [DEPOSIT_REQUEST_STATUS.APPROVED]: 'success',
    [DEPOSIT_REQUEST_STATUS.REJECTED]: 'error'
  };

  export default {
    name: 'PaymentHistory',

    mixins: [dateMixin, assetsMixin],

    data() {
      return {
        loading: false,
        headers: [
          { value: 'currency' },
          { value: 'date' },
          { value: 'amount' },
          { value: 'status', align: 'end' }
        ]
      };
    },

    computed: {
      paymentHistory() {
        const history = this.$store.getters['wallet/history']
          .map((p) => ({
            ...p,
            date: new Date(p.timestamp)
          }));

        const sorted = orderBy(history, ['date'], ['desc']);

        return sorted;
      }
    },

    created() {
      this.loading = true;
      this.$store.dispatch('wallet/getHistory', { account: this.$currentUser._id })
        .finally(() => {
          this.loading = false;
        });
    },

    methods: {
      formatDate(date) {
        return this.$$formatDate(date, 'PPpp');
      },

      formatAmount(amount, currency) {
        const asset = {
          amount: (amount / 100).toFixed(2),
          symbol: currency,
          precision: this.$store.getters['assets/one'](currency)?.precision
        };
        return this.$$formatAsset(asset);
      },

      getColorByDepositStatus(status) {
        return colorByDepositStatus[status];
      },

      formatStatus(status) {
        return this.$t(`account.wallet.paymentHistory.depositStatus.${DEPOSIT_REQUEST_STATUS[status]}`);
      }
    }
  };
</script>
