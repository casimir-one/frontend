<template>
  <vex-section v-if="ready" max-width="896" class="mx-auto">
    <ve-stack :gap="32">
      <vex-section-title>
        {{ title }}
      </vex-section-title>

      <c-team-form
        :schema="schema"
        :team="team"
        :mode="mode"
        v-bind="formProps"
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
  import { VexSection, VexSectionTitle, getBindableProps } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { TeamForm as CTeamForm } from '@deip/teams-module';

  import { rolesFactory } from '@/mixins';

  export default {
    name: 'TeamForm',

    components: {
      CTeamForm,
      VeStack,
      VexSection,
      VexSectionTitle
    },

    mixins: [rolesFactory('teamId')],

    props: {
      teamId: {
        type: String,
        default: null
      },

      ...CTeamForm.props,
      ...filterObjectKeys(formMixin.props, ['mode']) // need check
    },

    data() {
      return {
        ready: false
      };
    },

    computed: {
      schema() {
        return this.$layouts.getMappedData('team.form').value;
      },

      team() {
        return this.teamId ? this.$store.getters['teams/one'](this.teamId) : {};
      },

      formProps() {
        return getBindableProps.call(this, CTeamForm.props);
      },

      title() {
        return this.mode === VIEW_MODE.CREATE
          ? this.$t('teams.form.createTitle')
          : this.$t('teams.form.editTitle');
      }
    },

    async created() {
      if (this.teamId) {
        if (!this.$$isTeamAdmin) {
          this.$router.replace({ name: this.$route.meta.redirectTo, params: this.$route.params });
        }

        try {
          await this.getTeam();
          this.ready = true;
        } catch (error) {
          this.$notifier.showError(this.$t('teams.form.error'));
        }
      } else {
        this.ready = true;
      }
    },

    methods: {
      async getTeam() {
        return this.$store.dispatch('teams/getOne', this.teamId);
      },

      handleSuccess(teamId) {
        const messageKey = this.teamId ? 'successEdit' : 'successCreate';

        this.$notifier.showSuccess(this.$t(`teams.form.${messageKey}`));
        this.$router.push({ name: 'teams.details', params: { teamId } });
      },

      handleError(error) {
        this.$notifier.showError(error);
      }
    }

  };
</script>
