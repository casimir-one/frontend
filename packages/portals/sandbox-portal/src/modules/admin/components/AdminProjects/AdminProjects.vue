<template>
  <vex-section>
    <ve-stack :gap="32">
      <vex-section-title
        :title="$t('admin.projects.title')"
      />

      <projects-data-provider>
        <template #default="{ projects }">
          <v-data-table
            :items="projects"
            :headers="headers"

            :hide-default-footer="projects.length < itemsPerPage"
            :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
            :items-per-page="itemsPerPage"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.createdAt="{ item }">
              {{ formatCreatedDate(item.createdAt) }}
            </template>
          </v-data-table>
        </template>
      </projects-data-provider>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { ProjectsDataProvider } from '@deip/projects-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import { dateMixin } from '@deip/platform-components';

  export default {
    name: 'AdminProjects',

    components: {
      ProjectsDataProvider,
      VexSection,
      VexSectionTitle,
      VeStack
    },

    mixins: [dateMixin],

    data() {
      return {
        headers: [
          {
            text: this.$t('admin.projects.project.title'),
            value: 'title'
          },
          {
            text: this.$t('admin.projects.created'),
            value: 'createdAt'
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
