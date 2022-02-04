<template>
  <projects-data-provider :team-id="teamId">
    <template #default="{ projects, ready }">
      <v-data-iterator
        ref="iterator"
        :items="projects"
        :loading="!ready"
      >
        <template #default="{ items }">
          <ve-auto-grid
            cols="1"
            cols-sm="2"
            cols-md="3"
          >
            <project-card
              v-for="project of items"
              :key="project._id"
              :project="project"
            />
          </ve-auto-grid>
        </template>
      </v-data-iterator>
    </template>
  </projects-data-provider>
</template>

<script>
  import { ProjectsDataProvider } from '@deip/projects-module';
  import { VeAutoGrid } from '@deip/vue-elements';
  import { ProjectCard } from '@/modules/projects/components/ProjectCard';

  export default {
    name: 'ProjectList',

    components: {
      ProjectsDataProvider,
      VeAutoGrid,
      ProjectCard
    },

    props: {
      teamId: {
        type: String,
        default: undefined
      }
    }
  };
</script>
