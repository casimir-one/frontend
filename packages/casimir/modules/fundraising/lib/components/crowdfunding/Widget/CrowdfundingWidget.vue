<template>
  <v-card v-if="!loading" elevation="0" light>
    <v-card-text>
      <ve-stack :gap="24">
        <template v-if="investmentOpportunity">
          <crowdfunding-progress
            :investment-opportunity="investmentOpportunity"
          />

          <v-card
            v-if="investmentOpportunity.status != TS_TYPES.INACTIVE"
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
            v-if="investmentOpportunity.status === TS_TYPES.ACTIVE"
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
  import { orderBy } from '@deip/toolbox/lodash';
  import { TS_TYPES } from '@deip/constants';
  import { assetsMixin } from '@deip/assets-module';
  import { VeStack } from '@deip/vue-elements';

  import CrowdfundingProgress from '../Progress/CrowdfundingProgress';

  export default defineComponent({
    name: 'CrowdfundingWidget',

    components: {
      VeStack,
      CrowdfundingProgress
    },

    mixins: [assetsMixin, dateMixin],

    props: {
      projectId: {
        type: String,
        required: true
      },

      investLink: {
        type: Object,
        default: null
      },

      startCrowdfundingLink: {
        type: Object,
        default: null
      },

      canUserStartCrowdfunding: {
        type: Boolean,
        default: false
      },

      autoUpdateTime: {
        type: Number,
        default: 60000 // 1 minute
      }
    },

    data() {
      return {
        loading: false,
        TS_TYPES,
        timerId: ''
      };
    },

    computed: {
      investmentOpportunity() {
        const projectInvestmentOpportunities = this.$store.getters['fundraising/list']({
          projectId: this.projectId
        });

        if (!projectInvestmentOpportunities.length) {
          return null;
        }

        const sorted = orderBy(projectInvestmentOpportunities, ['startTime'], ['desc']);

        return sorted[0];
      },

      isCrowdfundingCanBeStarted() {
        return this.canUserStartCrowdfunding
          && (!this.investmentOpportunity
            || [TS_TYPES.FINISHED, TS_TYPES.EXPIRED].includes(this.investmentOpportunity?.status));
      },

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
      updateComponentData() {
        if (!this.investmentOpportunity) return null;
        const { status } = this.investmentOpportunity;
        const {
          INACTIVE, EXPIRED, FINISHED
        } = TS_TYPES;

        if (status === INACTIVE) {
          return this.$store.dispatch('fundraising/getListByProjectId', this.projectId)
            .catch((error) => { console.error(error); });
        }

        if ([FINISHED, EXPIRED].includes(status)) {
          this.cancelAutoUpdate();
          return this.getProjectInvestmentOpportunityData();
        }

        return this.getProjectInvestmentOpportunityData();
      },

      getProjectInvestmentOpportunityData() {
        return this.$store.dispatch('fundraising/getListByProjectId', this.projectId)
          .then(() => {
            if (this.investmentOpportunity) {
              this.$store.dispatch('fundraising/getInvestmentOpportunityInvestments', this.investmentOpportunity._id);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },

      cancelAutoUpdate() {
        clearInterval(this.timerId);
      }
    }
  });
</script>
