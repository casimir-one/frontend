<template>
  <v-card v-if="!loading" elevation="0" light>
    <v-card-text>
      <ve-stack :gap="24">
        <template v-if="investmentOpportunity">
          <crowdfunding-progress
            :investment-opportunity="investmentOpportunity"
          />

          <v-card
            v-if="investmentOpportunity.status != INVESTMENT_OPPORTUNITY_STATUS.INACTIVE"
            outlined
            class="py-2 px-3 d-flex justify-space-between"
          >
            <span>{{ $t('module.crowdfunding.crowdfundingWidget.yourInvestment') }}</span>
            <span
              v-if="userInvestment"
              class="primary--text font-weight-medium"
            >{{ $$formatAsset(userInvestment) }}</span>
          </v-card>

          <v-btn
            v-if="investmentOpportunity.status === INVESTMENT_OPPORTUNITY_STATUS.ACTIVE"
            :to="investLink"
            color="primary"
            depressed
          >
            {{ $t('module.crowdfunding.crowdfundingWidget.invest') }}
          </v-btn>
        </template>

        <span v-else>
          {{ $t('module.crowdfunding.crowdfundingWidget.noCrowdfunding') }}
        </span>

        <v-btn
          v-if="isCrowdfundingCanBeStarted"
          :to="startCrowdfundingLink"
          color="primary"
          depressed
        >
          {{ $t('module.crowdfunding.crowdfundingWidget.startCrowdfunding') }}
        </v-btn>
      </ve-stack>
    </v-card-text>
  </v-card>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { dateMixin } from '@deip/platform-components';
  import { orderBy } from 'lodash';
  import { INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
  import { assetsMixin } from '@deip/assets-module';
  import { VeStack } from '@deip/vue-elements';

  import CrowdfundingProgress from '../Progress/CrowdfundingProgress';

  /**
   * Component for crowdfunding widget
   */
  export default defineComponent({
    name: 'CrowdfundingWidget',

    components: {
      VeStack,
      CrowdfundingProgress
    },

    mixins: [assetsMixin, dateMixin],

    props: {
      /**
       * Project id
       */
      projectId: {
        type: String,
        required: true
      },
      /**
       * Invest link info
       */
      investLink: {
        type: Object,
        default: null
      },
      /**
       * Start crowdfunding link info
       */
      startCrowdfundingLink: {
        type: Object,
        default: null
      },
      /**
       * Can user start crowdfunding
       */
      canUserStartCrowdfunding: {
        type: Boolean,
        default: false
      },
      /**
       * Auto update time in milliseconds
       */
      autoUpdateTime: {
        type: Number,
        default: 60000 // 1 minute
      }
    },

    data() {
      return {
        loading: false,
        INVESTMENT_OPPORTUNITY_STATUS,
        timerId: ''
      };
    },

    computed: {
      /**
       * Get computed project investment opportunity
       */
      investmentOpportunity() {
        const projectInvestmentOpportunities = this.$store.getters['investmentOpportunities/list']({
          projectId: this.projectId
        });

        if (!projectInvestmentOpportunities.length) {
          return null;
        }

        const sorted = orderBy(projectInvestmentOpportunities, ['startTime'], ['desc']);

        return sorted[0];
      },
      /**
       * Checks if user can start crowdfunding
       */
      isCrowdfundingCanBeStarted() {
        return this.canUserStartCrowdfunding
          && (!this.investmentOpportunity
            || [INVESTMENT_OPPORTUNITY_STATUS.FINISHED, INVESTMENT_OPPORTUNITY_STATUS.EXPIRED]
              .includes(this.investmentOpportunity?.status));
      },
      /**
       * Get computed user investment info
       */
      userInvestment() {
        if (!this.investmentOpportunity) {
          return null;
        }

        if (!this.investmentOpportunity.investments) {
          return {
            ...this.investmentOpportunity.hardCap,
            amount: 0
          };
        }

        const amount = this.investmentOpportunity.investments.reduce((acc, current) => {
          if (current.investor === this.$currentUser._id) {
            // eslint-disable-next-line no-param-reassign
            acc += parseFloat(current.asset.amount);
          }
          return acc;
        }, 0);

        return {
          ...this.investmentOpportunity.hardCap,
          amount
        };
      }
    },

    created() {
      this.timerId = setInterval(this.updateComponentData.bind(this), this.autoUpdateTime);

      this.loading = true;
      this.getProjectInvestmentOpportunityData().finally(() => {
        this.loading = false;
      });
    },

    destroyed() {
      this.cancelAutoUpdate();
    },

    methods: {
      /**
       * Update project investment opportunity data
       */
      updateComponentData() {
        if (!this.investmentOpportunity) return null;
        const { status } = this.investmentOpportunity;
        const {
          INACTIVE, EXPIRED, FINISHED
        } = INVESTMENT_OPPORTUNITY_STATUS;

        if (status === INACTIVE) {
          return this.$store.dispatch('investmentOpportunities/getListByProjectId', this.projectId)
            .catch((error) => { console.error(error); });
        }

        if ([FINISHED, EXPIRED].includes(status)) {
          this.cancelAutoUpdate();
          return this.getProjectInvestmentOpportunityData();
        }

        return this.getProjectInvestmentOpportunityData();
      },
      /**
       * Get project investment opportunity data
       */
      getProjectInvestmentOpportunityData() {
        return this.$store.dispatch(
          'investmentOpportunities/getListByProjectId',
          this.projectId
        )
          .then(() => {
            if (this.investmentOpportunity) {
              this.$store.dispatch(
                'investmentOpportunities/getInvestmentOpportunityInvestments',
                this.investmentOpportunity._id
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
      /**
       * Cancel auto update
       */
      cancelAutoUpdate() {
        clearInterval(this.timerId);
      }
    }
  });
</script>
