<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :outlined="!hover"
      :raised="hover"
      class="transition-ease-in-out pa-6"
      :to="{name: 'teams.details', params: { teamId: team._id }}"
    >
      <c-team-details
        :team="team"
        :schema="$layouts.getMappedData('team.listCard').value"
      />
    </v-card>
  </v-hover>
</template>

<script>
  import { TeamDetails as CTeamDetails } from '@deip/teams-module';

  export default {
    name: 'TeamCard',

    components: {
      CTeamDetails
    },

    props: {
      team: {
        type: Object,
        required: true
      }
    }
  };
</script>
