<template>
  <vex-section v-if="ready" max-width="896" class="mx-auto">
    <ve-stack :gap="32">
      <vex-section-title>
        {{ title }}
      </vex-section-title>

      <c-project-form
        :team-id="teamId"
        :project="project"
        :schema="schema"
        :mode="mode"
        @success="handleSuccess"
        @error="handleError"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VIEW_MODE } from '@deip/constants';
  import { formMixin } from '@deip/platform-components';
  import { filterObjectKeys } from '@deip/toolbox';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { ProjectForm as CProjectForm } from '@deip/projects-module';

  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectForm',
    components: {
      VexSection,
      VexSectionTitle,
      VeStack,
      CProjectForm
    },

    mixins: [rolesFactory('teamIdComputed')],

    props: {
      teamId: {
        type: String,
        default: null
      },
      projectId: {
        type: String,
        default: null
      },
      ...filterObjectKeys(formMixin.props, ['mode'])
    },

    data() {
      return {
        ready: false
      };
    },

    computed: {
      teamIdComputed() {
        return this.project?.teamId || this.teamId;
      },
      project() {
        return this.projectId ? this.$store.getters['projects/one'](this.projectId) : {};
      },

      schema() {
        return this.$layouts.getMappedData('project.form')?.value;
      },

      title() {
        return this.mode === VIEW_MODE.CREATE
          ? this.$t('projects.form.createTitle')
          : this.$t('projects.form.editTitle');
      }
    },

    async created() {
      if (this.projectId) {
        try {
          await this.getProject();
          this.checkAccess();
          this.ready = true;
        } catch (error) {
          this.$notifier.showError(this.$t('projects.form.error'));
        }
      } else {
        this.checkAccess();
        this.ready = true;
      }
    },

    methods: {
      async getProject() {
        return this.$store.dispatch('projects/getOne', this.projectId);
      },

      checkAccess() {
        if (!this.$$isTeamAdmin) {
          this.$router.replace({ name: this.$route.meta.redirectTo, params: this.$route.params });
        }
      },

      handleSuccess(projectId) {
        const messageKey = this.mode === VIEW_MODE.CREATE
          ? 'successCreate'
          : 'successEdit';

        this.$notifier.showSuccess(this.$t(`projects.form.${messageKey}`));
        this.$router.push({ name: 'projects.details', params: { projectId } });
      },

      handleError(error) {
        this.$notifier.showError(error);
      }
    }
  };
</script>
