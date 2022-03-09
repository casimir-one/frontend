<template>
  <vex-section>
    <ve-stack :gap="32">
      <vex-section-title
        :title="$t('admin.teams.title')"
      >
        <template #append>
          <v-btn
            small
            outlined
            color="primary"
            :to="{ name: 'teams.create' }"
          >
            {{ $t('admin.teams.add') }}
          </v-btn>
        </template>
      </vex-section-title>

      <teams-data-provider>
        <template #default="{ teams }">
          <v-data-table
            :items="teams"
            :headers="headers"

            :hide-default-footer="teams.length < itemsPerPage"
            :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
            :items-per-page="itemsPerPage"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.createdAt="{ item }">
              {{ formatCreatedDate(item.createdAt) }}
            </template>
          </v-data-table>
        </template>
      </teams-data-provider>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { TeamsDataProvider } from '@deip/teams-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import { dateMixin } from '@deip/platform-components';

  export default {
    name: 'AdminTeams',

    components: {
      TeamsDataProvider,
      VexSection,
      VexSectionTitle,
      VeStack
    },
    mixins: [
      dateMixin
    ],

    data() {
      return {
        headers: [
          {
            text: this.$t('admin.teams.team.id'),
            value: '_id'
          },
          {
            text: this.$t('admin.teams.team.title'),
            value: 'title'
          },
          {
            text: this.$t('admin.teams.team.created'),
            value: 'createdAt'
          },
          {
            text: this.$t('admin.teams.team.creator'),
            value: 'creator'
          }
        ],
        itemsPerPage: 50
      };
    },

    methods: {
      formatCreatedDate(date) {
        return this.$$formatDate(this.$$parseISO(date));
      }
    }
  };
</script>
