<template>
  <vex-section>
    <ve-stack>
      <vex-section-title
        :title="$t('teams.list.title')"
      >
        <template v-if="canCreate" #append>
          <v-btn
            color="primary"
            :to="{ name: 'teams.create' }"
          >
            {{ $t('teams.list.create') }}
          </v-btn>
        </template>
      </vex-section-title>

      <teams-data-provider :filter-items="filterItems">
        <template #default="{ teams, ready }">
          <v-data-iterator
            ref="iterator"
            :items="teams"
            :loading="!ready"
          >
            <template #default="{ items }">
              <ve-auto-grid
                cols="1"
                cols-sm="2"
                cols-md="3"
              >
                <team-card
                  v-for="team of items"
                  :key="team._id"
                  :team="team"
                />
              </ve-auto-grid>
            </template>
          </v-data-iterator>
        </template>
      </teams-data-provider>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { TeamsDataProvider } from '@deip/teams-module';
  import { VeAutoGrid, VeStack } from '@deip/vue-elements';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { TeamCard } from '../TeamCard';

  export default {
    name: 'TeamList',

    components: {
      TeamsDataProvider,
      VexSection,
      VexSectionTitle,
      VeAutoGrid,
      VeStack,
      TeamCard
    },

    props: {
      filterItems: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      canCreate() {
        return this.$currentUser.exists();
      }
    }
  };
</script>
