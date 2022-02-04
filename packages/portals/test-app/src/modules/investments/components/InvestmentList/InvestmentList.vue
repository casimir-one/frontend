<template>
  <vex-section>
    <ve-stack>
      <vex-section-title
        :title="$t('investments.list.title')"
      />

      <v-data-iterator
        ref="iterator"
        :items="investments"
        :loading="!ready"
      >
        <template #default="{ items }">
          <ve-auto-grid
            cols="1"
            cols-sm="2"
            cols-md="3"
          >
            <investment-card
              v-for="item of items"
              :key="item.investmentOpportunity._id"
              :investment="item"
            />
          </ve-auto-grid>
        </template>
      </v-data-iterator>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VeStack, VeAutoGrid } from '@deip/vue-elements';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';

  import { InvestmentCard } from '@/modules/investments/components/InvestmentCard';

  export default {
    name: 'InvestmentList',
    components: {
      VeStack,
      VeAutoGrid,
      VexSection,
      VexSectionTitle,
      InvestmentCard
    },

    data() {
      return {
        investmentsHistory: [],
        ready: false
      };
    },

    computed: {
      /** @return {object[]} */
      investments() {
        return this.investmentsHistory.map((i) => ({
          ...i,
          project: this.$store.getters['projects/one'](i.projectId),
          investmentOpportunity: this.$store.getters['fundraising/one'](i.investmentOpportunity._id)
        }));
      }
    },

    async created() {
      await this.createInvestmentListData();
      this.ready = true;
    },

    methods: {
      /**
       * @param {number[]} projectIds
       * @return {Promise<void>}
       */
      async getProjectsByIds(projectIds) {
        try {
          await this.$store.dispatch('projects/getProjectsByIds', projectIds);
        } catch (error) {
          console.error(error);
        }
      },

      /**
       * @param {number[]} investmentOpportunityIds
       * @return {Promise<void>}
       */
      async getInvestorsByInvestmentOpportunityIds(investmentOpportunityIds) {
        try {
          const action = (id) => this.$store.dispatch('fundraising/getInvestmentOpportunityInvestments', id);
          await Promise.all(investmentOpportunityIds.map((id) => action(id)));
        } catch (error) {
          console.error(error);
        }
      },

      /**
       * @param {string} id
       * @return {Promise<object[]>}
       */
      async getInvestmentsHistoryByUserId(id) {
        try {
          return this.$store.dispatch('fundraising/getInvestmentsHistory', id);
        } catch (error) {
          console.error(error);

          return [];
        }
      },

      /**
       * @return {Promise<void>}
       */
      async createInvestmentListData() {
        try {
          const data = await this.getInvestmentsHistoryByUserId(this.$currentUser._id);

          if (!data.length) return;

          const investmentOpportunityIds = data.map((item) => item.investmentOpportunity._id);
          const projectIds = data.map((item) => item.projectId);

          await Promise.all([
            this.getInvestorsByInvestmentOpportunityIds(investmentOpportunityIds),
            this.getProjectsByIds(projectIds)
          ]);

          this.investmentsHistory = data;
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
</script>
