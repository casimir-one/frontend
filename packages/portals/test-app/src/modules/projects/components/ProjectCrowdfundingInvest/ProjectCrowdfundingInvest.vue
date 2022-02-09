<template>
  <vex-section v-if="ready" max-width="736" class="mx-auto">
    <invest-form
      v-if="investmentOpportunity"
      :investment-opportunity="investmentOpportunity"
      tos-url=""
      @success="handleSuccess"
      @error="handleError"
      @cancel="handleCancel"
    >
      <template #header>
        <div :class="titleClass">
          {{ projectName }}
        </div>
      </template>
    </invest-form>
  </vex-section>
</template>

<script>
  import { InvestForm } from '@deip/investment-opportunities-module';
  import { INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
  import { VexSection } from '@deip/vuetify-extended';

  export default {
    name: 'ProjectCrowdfundingInvest',

    components: {
      InvestForm,
      VexSection
    },

    props: {
      projectId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        ready: false
      };
    },

    computed: {
      investmentOpportunity() {
        if (!this.project) {
          return null;
        }

        const projectInvestmentOpportunities = this.$store.getters['investmentOpportunities/list']({
          status: INVESTMENT_OPPORTUNITY_STATUS.ACTIVE,
          projectId: this.project._id
        });

        if (!projectInvestmentOpportunities.length) {
          return null;
        }
        return projectInvestmentOpportunities[0];
      },

      project() {
        if (!this.projectId) {
          return null;
        }
        return this.$store.getters['projects/one'](this.projectId);
      },

      titleClass() {
        return this.$vuetify.breakpoint.smAndUp ? 'text-h2' : 'text-h3';
      },

      projectName() {
        return this.$attributes.getMappedData(
          'project.name',
          this.project?.attributes
        )?.value;
      }
    },

    async created() {
      await this.getProject();
      await this.getCurrentInvestmentOpportunity();

      this.ready = true;
    },

    methods: {
      async getProject() {
        try {
          await this.$store.dispatch('projects/getOne', this.projectId);
          if (!this.project) {
          // redirect to not found
          }
        } catch (error) {
          console.error(error);
          this.$notifier.showError('try again');
        }
      },

      async getCurrentInvestmentOpportunity() {
        try {
          await this.$store.dispatch('investmentOpportunities/getCurrentInvestmentOpportunityByProject', this.project._id);
          if (this.investmentOpportunity) {
            this.$store.dispatch('investmentOpportunities/getInvestmentOpportunityInvestments', this.investmentOpportunity._id);
          } else {
            this.$router.replace({ name: this.$route.meta.redirectTo, params: this.$route.params });
          }
        } catch (error) {
          console.error(error);
          this.$notifier.showError('try again');
        }
      },

      handleSuccess() {
        this.$notifier.showSuccess(this.$t('projects.invest.success'));
        this.$router.push({ name: 'projects.details', params: { projectId: this.projectId } });
      },

      handleError(error) {
        this.$notifier.showError(error);
      },

      handleCancel() {
        this.$router.push({ name: 'projects.details', params: { projectId: this.projectId } });
      }
    }
  };
</script>
