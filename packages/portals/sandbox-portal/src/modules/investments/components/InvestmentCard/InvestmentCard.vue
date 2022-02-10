<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :outlined="!hover"
      :elevation="hover ? 8 : 0"
      class="transition-ease-in-out"
      :to="{name: 'projects.details', params: { projectId: investment.project._id }}"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-1">
            {{ getProjectName(investment.project) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-card-text>
        <ve-stack :gap="16">
          <v-chip-group>
            <v-chip small :color="statusColor">
              {{ statusText }}
            </v-chip>
          </v-chip-group>

          <crowdfunding-progress
            :investment-opportunity="investment.investmentOpportunity"
            small
          />
        </ve-stack>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
  import { CrowdfundingProgress } from '@deip/investment-opportunities-module';
  import { VeStack } from '@deip/vue-elements';
  import { INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';

  export default {
    name: 'InvestmentCard',

    components: {
      VeStack,
      CrowdfundingProgress
    },

    props: {
      investment: {
        type: Object,
        required: true
      }
    },

    computed: {
      statusText() {
        return this.$t(`constants.investmentOpportunityStatus.${INVESTMENT_OPPORTUNITY_STATUS[this.investment.investmentOpportunity.status]}`);
      },
      statusColor() {
        if (this.investment.investmentOpportunity.status
          === INVESTMENT_OPPORTUNITY_STATUS.FINISHED) {
          return 'success';
        }
        if (this.investment.investmentOpportunity.status
          === INVESTMENT_OPPORTUNITY_STATUS.EXPIRED) {
          return 'error';
        }
        return 'info';
      }
    },

    methods: {
      getProjectName(project) {
        return this.$attributes.getMappedData(
          'project.name',
          project?.attributes
        )?.value;
      }
    }
  };
</script>
