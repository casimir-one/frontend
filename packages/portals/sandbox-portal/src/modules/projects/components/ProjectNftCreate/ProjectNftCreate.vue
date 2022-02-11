<template>
  <vex-section v-if="ready" max-width="896" class="mx-auto">
    <create-non-fungible-token-form
      :project="project"
      :team="team"
      :project-alias="$t('projects.nftCreate.project')"
      tos-url=""
      @success="handleSuccess"
      @error="handleError"
    />
  </vex-section>
</template>

<script>
  import { VexSection } from '@deip/vuetify-extended';
  import { CreateNonFungibleTokenForm } from '@deip/assets-module';
  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectNftCreate',

    components: {
      VexSection,
      CreateNonFungibleTokenForm
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
        ready: false
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

      team() {
        if (!this.project) {
          return null;
        }
        return this.$store.getters['teams/one'](this.project.teamId);
      }
    },

    async created() {
      await this.getProject();
      this.ready = true;
    },

    methods: {
      async getProject() {
        try {
          await this.$store.dispatch('projects/getOne', this.projectId);
          if (!this.project) {
          // redirect to not found
          }

          await this.$store.dispatch('teams/getOne', this.teamId);

          this.checkAccess();
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
        this.$notifier.showSuccess(this.$t('projects.nftCreate.success'));
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
