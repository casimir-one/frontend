<template>
  <vex-section v-if="ready" max-width="896" class="mx-auto">
    <ve-stack :gap="32">
      <div class="text-h2">
        {{ projectName }}
      </div>

      <create-crowdfunding-form
        v-if="project"
        :project="project"
        :cap-assets-filter="capAssetsFilter"
        no-hard-cap
        @success="handleSuccess"
        @error="handleError"
        @cancel="handleCancel"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { CreateCrowdfundingForm } from '@deip/investment-opportunities-module';
  import { ASSET_TYPE, INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
  import { VexSection } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectCrowdfundingCreate',

    components: {
      CreateCrowdfundingForm,
      VexSection,
      VeStack
    },

    mixins: [
      rolesFactory('teamId')
    ],

    props: {
      projectId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        ready: false,
        capAssetsFilter: { type: ASSET_TYPE.COIN }
      };
    },

    computed: {
      project() {
        if (!this.projectId) {
          return null;
        }
        return this.$store.getters['projects/one'](this.projectId);
      },

      teamId() {
        return this.project?.teamId;
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
      await this.getInvestmentOpportunities();

      const activeInvestmentOpportunities = this.$store.getters['investmentOpportunities/list']({
        status: [INVESTMENT_OPPORTUNITY_STATUS.ACTIVE, INVESTMENT_OPPORTUNITY_STATUS.INACTIVE],
        projectId: this.project._id
      });

      if (activeInvestmentOpportunities.length) {
        this.$router.push({ name: this.$route.meta.redirectTo, params: this.$route.params });
      }

      this.ready = true;
    },

    methods: {
      async getProject() {
        try {
          await this.$store.dispatch('projects/getOne', this.projectId);
          if (!this.project) {
          // redirect to not found
          }

          this.checkAccess();
        } catch (error) {
          console.error(error);
        }
      },

      async getInvestmentOpportunities() {
        try {
          await this.$store.dispatch('investmentOpportunities/getCurrentInvestmentOpportunityByProject', this.project._id);
        } catch (error) {
          console.error(error);
        }
      },

      checkAccess() {
        if (!this.$$isTeamAdmin) {
          this.$router.replace({ name: this.$route.meta.redirectTo, params: this.$route.params });
        }
      },

      handleSuccess() {
        this.$notifier.showSuccess(this.$t('projects.crowdfundingCreate.success'));
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
