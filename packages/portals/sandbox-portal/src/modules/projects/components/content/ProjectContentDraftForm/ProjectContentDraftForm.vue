<template>
  <vex-section v-if="ready" max-width="896" class="mx-auto">
    <ve-stack :gap="32">
      <vex-section-title>
        {{ title }}
      </vex-section-title>

      <c-project-content-draft-form
        :project="project"
        :draft="draft"
        :mode="mode"
        @cancel="handleCancel"
        @success="handleSuccess"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { ProjectContentDraftForm as CProjectContentDraftForm } from '@deip/project-content-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { formMixin } from '@deip/platform-components';
  import { filterObjectKeys } from '@deip/toolbox';
  import { VIEW_MODE } from '@deip/constants';

  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectContentDraftForm',

    components: {
      VexSection,
      VexSectionTitle,
      VeStack,
      CProjectContentDraftForm
    },

    mixins: [rolesFactory('teamId')],

    props: {
      projectId: {
        type: String,
        required: true
      },

      draftId: {
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
      project() {
        if (!this.projectId) {
          return null;
        }
        return this.$store.getters['projects/one'](this.projectId);
      },

      draft() {
        return this.draftId ? this.$store.getters['projectContentDrafts/one'](this.draftId) : null;
      },

      teamId() {
        return this.project?.teamId;
      },

      projectName() {
        return this.$attributes.getMappedData(
          'project.name',
          this.project?.attributes
        )?.value;
      },

      title() {
        return this.mode === VIEW_MODE.CREATE
          ? this.$t('projects.contentDraft.form.titleCreate', { name: this.projectName })
          : this.$t('projects.contentDraft.form.titleEdit', { name: this.projectName });
      }
    },

    async created() {
      await this.getProject();

      if (!this.project) {
        // redirect to not found
      }

      this.checkAccess();

      if (this.draftId) {
        await this.getDraft();
      }

      this.ready = true;
    },

    methods: {
      async getProject() {
        try {
          await this.$store.dispatch('projects/getOne', this.projectId);
        } catch (error) {
          console.error(error);
        }
      },

      async getDraft() {
        try {
          await this.$store.dispatch('projectContentDrafts/getOne', this.draftId);
        } catch (error) {
          console.error(error);
        }
      },

      checkAccess() {
        if (!this.$$isTeamAdmin) {
          this.$router.replace({ name: this.$route.meta.redirectTo, params: this.$route.params });
        }
      },

      handleCancel() {
        this.$router.back();
      },

      handleSuccess() {
        const messageKey = this.mode === VIEW_MODE.CREATE
          ? 'successCreate'
          : 'successEdit';

        this.$notifier.showSuccess(this.$t(`projects.contentDraft.form.${messageKey}`));
        this.$router.push({ name: 'projects.details', params: { projectId: this.projectId } });
      }
    }
  };
</script>
