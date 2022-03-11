<template>
  <div>
    <div :class="headerWrapperClass">
      <div class="d-flex justify-space-between align-end text-caption ">
        <div :class="collectedClass">
          <span :class="collectedTitleClass">
            {{ $t('module.crowdfunding.crowdfundingProgress.collected') }}:
          </span>
          <span
            :class="collectedAmountClass"
          >{{ collected.amount }} {{ collected.symbol }}
          </span>
        </div>

        <div>
          <span v-if="small" class="text--secondary">
            {{ $t('module.crowdfunding.crowdfundingProgress.goal') }}:
          </span>
          <span class="text--primary font-weight-medium">
            {{ hardCap.amount }} {{ hardCap.symbol }}
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
      <div v-if="investmentOpportunity.status === INVESTMENT_OPPORTUNITY_STATUS.ACTIVE">
        <span class="font-weight-medium">
          {{ $t('module.crowdfunding.crowdfundingProgress.untilCompletion') }}:
        </span>
        <span>{{ remainingTime }}</span>
      </div>

      <div v-else-if="investmentOpportunity.status === INVESTMENT_OPPORTUNITY_STATUS.INACTIVE">
        <span class="font-weight-medium">
          {{ $t('module.crowdfunding.crowdfundingProgress.beforeStart') }}:
        </span>
        <span>{{ beforeStartTime }}</span>
      </div>

      <div>
        <span class="font-weight-medium">
          {{ $t('module.crowdfunding.crowdfundingProgress.investors') }}:
        </span>
        <span>{{ investmentsCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { dateMixin } from '@deip/platform-components';
  import { INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
  import { isString } from '@deip/toolbox';
  import { uniqBy } from '@deip/toolbox/lodash';
  /**
   * Component for crowdfunding progress
   * @displayName  CrowdfundingProgress
   */
  export default {
    name: 'CrowdfundingProgress',

    mixins: [dateMixin],

    props: {
      /**
       * Investment opportunity info
       */
      investmentOpportunity: {
        type: Object,
        required: true,
        default() { return {}; }
      },
      /**
       * Should have small size
       */
      small: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        INVESTMENT_OPPORTUNITY_STATUS
      };
    },

    computed: {
      /**
       * Get computed hard cap info
       */
      hardCap() {
        return this.investmentOpportunity?.hardCap;
      },
      /**
       * Get computed collected amount info
       */
      collected() {
        return this.investmentOpportunity?.totalInvested;
      },
      /**
       * Get computed current progress
       */
      currentPercent() {
        if (!this.hardCap) { return 0; }
        return (this.collected.amount * 100) / this.hardCap.amount;
      },
      /**
       * Get computed remaining time
       */
      remainingTime() {
        return this.formatTimeToNow(this.investmentOpportunity?.endTime);
      },
      /**
       * Get computed time distance before investment opportunity start time
       */
      beforeStartTime() {
        return this.formatTimeToNow(this.investmentOpportunity?.startTime);
      },
      /**
       * Get investments count
       */
      investmentsCount() {
        if (!this.investmentOpportunity?.investments) {
          return 0;
        }
        return uniqBy(this.investmentOpportunity.investments, 'investor').length;
      },
      /**
       * Get bar color depending on investment opportunity status
       */
      barColor() {
        return this.investmentOpportunity.status === INVESTMENT_OPPORTUNITY_STATUS.EXPIRED ? 'error' : 'success';
      },
      /**
       * Get bar height
       */
      barHeight() {
        return this.small ? 4 : 8;
      },
      /**
       * Get header wrapper class
       */
      headerWrapperClass() {
        return ['pos-relative', { 'mb-1': this.small, 'mb-2': !this.small }];
      },
      /**
       * Get collected class
       */
      collectedClass() {
        return { 'd-flex flex-column': !this.small };
      },
      /**
       * Get collected title class
       */
      collectedTitleClass() {
        return ['text--secondary', { 'text-overline': !this.small }];
      },
      /**
       * Get collected amount class
       */
      collectedAmountClass() {
        return ['text--primary font-weight-medium',
                { 'text-h3': !this.small }];
      }
    },

    methods: {
      /**
       * Get time distance from param to now
       *
       * @param {string} time
       */
      formatTimeToNow(time) {
        const timeToFormat = isString(time)
          ? this.$$parseISO(time, true)
          : new Date(time);

        return this.$$formatDistanceToNow(timeToFormat);
      }
    }
  };
</script>
