<template>
  <div>
    <div :class="headerWrapperClass">
      <div class="d-flex justify-space-between align-end text-caption ">
        <div :class="collectedClass">
          <span :class="collectedTitleClass">
            {{ $t('module.fundraising.fundraisingProgress.collected') }}:
          </span>
          <span
            :class="collectedAmountClass"
          >{{ collected.amount }} {{ collected.assetId }}
          </span>
        </div>

        <div>
          <span v-if="small" class="text--secondary">
            {{ $t('module.fundraising.fundraisingProgress.goal') }}:
          </span>
          <span class="text--primary font-weight-medium">
            {{ hardCap.amount }} {{ hardCap.assetId }}
          </span>
        </div>
      </div>
    </div>

    <v-progress-linear
      :value="currentPercent"
      :height="barHeight"
      :color="barColor"
      :background-color="`${barColor} lighten-5`"
      rounded
      :class="{'mb-4': small, 'mb-6': !small}"
    />

    <div class="text-caption text--secondary">
      <div v-if="tokenSale.status === TS_TYPES.ACTIVE">
        <span class="font-weight-medium">
          {{ $t('module.fundraising.fundraisingProgress.untilCompletion') }}:
        </span>
        <span>{{ remainingTime }}</span>
      </div>

      <div>
        <span class="font-weight-medium">
          {{ $t('module.fundraising.fundraisingProgress.investors') }}:
        </span>
        <span>{{ contributionsCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { dateMixin } from '@deip/platform-components';
  import { TS_TYPES } from '@deip/constants';
  import { assetsMixin } from '@deip/assets-module';
  import { uniqBy } from '@deip/toolbox/lodash';

  export default {
    name: 'FundraisingProgress',

    mixins: [dateMixin, assetsMixin],

    props: {
      tokenSale: {
        type: Object,
        required: true,
        default() { return {}; }
      },
      small: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        TS_TYPES
      };
    },

    computed: {
      hardCap() {
        return this.$$fromAssetUnits(this.tokenSale?.hardCap);
      },
      collected() {
        return this.$$fromAssetUnits(this.tokenSale?.totalAmount);
      },
      currentPercent() {
        if (!this.hardCap) { return 0; }
        return (this.collected.amount * 100) / this.hardCap.amount;
      },
      remainingTime() {
        return this.$$formatDistanceToNow(this.$$parseISO(this.tokenSale?.endTime, true));
      },
      contributionsCount() {
        if (!this.tokenSale?.contributions) {
          return 0;
        }
        return uniqBy('contributor', this.tokenSale.contributions).length;
      },
      barColor() {
        return this.tokenSale.status === TS_TYPES.EXPIRED ? 'error' : 'success';
      },
      barHeight() {
        return this.small ? 4 : 8;
      },
      headerWrapperClass() {
        return ['pos-relative', { 'mb-1': this.small, 'mb-2': !this.small }];
      },
      collectedClass() {
        return { 'd-flex flex-column': !this.small };
      },
      collectedTitleClass() {
        return ['text--secondary', { 'text-overline': !this.small }];
      },
      collectedAmountClass() {
        return ['text--primary font-weight-medium',
                { 'text-h3': !this.small }];
      }
    }
  };
</script>
