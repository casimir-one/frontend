<template>
  <div v-if="ready">
    <v-toolbar v-if="canEdit">
      <v-spacer />
      <ve-stack
        flow="column"
        :gap="4"
        class="justify-end"
      >
        <v-btn
          text
          color="primary"
          small
          :to="{name: 'teams.edit'}"
          class="align-self-center"
        >
          <v-icon left>
            mdi-pencil-outline
          </v-icon>
          {{ $t('teams.details.edit') }}
        </v-btn>

        <v-btn
          text
          color="primary"
          small
          :to="{name: 'projects.create', query: { teamId }}"
          class="align-self-center"
        >
          {{ $t('teams.details.createProject') }}
        </v-btn>
      </ve-stack>
    </v-toolbar>

    <c-team-details
      v-if="schema"
      :team="team"
      :schema="schema"
    />
    <v-divider />

    <vex-section>
      <ve-stack :gap="24">
        <span class="text-h6">{{ $t('teams.details.members') }}:</span>
        <users-list-stack :users="team.members" />
      </ve-stack>
    </vex-section>

    <v-divider />

    <vex-section>
      <ve-stack :gap="24">
        <span class="text-h6">{{ $t('teams.details.projects') }}:</span>
        <project-cards-list :team-id="teamId" />
      </ve-stack>
    </vex-section>
  </div>
</template>

<script>
  import { TeamDetails as CTeamDetails } from '@deip/teams-module';
  import { VeStack } from '@deip/vue-elements';
  import { VexSection } from '@deip/vuetify-extended';
  import { UsersListStack } from '@deip/users-module';
  import { rolesFactory } from '@/mixins';
  import { ProjectCardsList } from '@/modules/projects/components/ProjectCardsList';

  export default {
    name: 'TeamDetails',

    components: {
      VeStack,
      VexSection,
      UsersListStack,
      CTeamDetails,
      ProjectCardsList
    },

    mixins: [rolesFactory('teamId')],

    props: {
      teamId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        ready: false,
        teamProject: {}
      };
    },

    computed: {
      team() {
        return this.teamId ? this.$store.getters['teams/one'](this.teamId) : {};
      },

      schema() {
        return this.$layouts.getMappedData('team.details')?.value;
      },

      canEdit() {
        return this.$$isTeamAdmin;
      }
    },

    created() {
      this.getTeam();
    },

    methods: {
      async getTeam() {
        if (this.teamId) {
          try {
            await this.$store.dispatch('teams/getOne', this.teamId);
          } catch (error) {
            console.error(error);
          }
        }
        this.ready = true;
      }
    }
  };
</script>
