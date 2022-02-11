<template>
  <v-hover v-slot="{ hover }">
    <v-card
      outlined
      :raised="hover"
      class="transition-ease-in-out pa-6"
      :to="{name: 'projects.details', params: { projectId: project._id }}"
    >
      <c-project-details
        :project="project"
        :schema="$layouts.getMappedData('project.listCard').value"
      />
    </v-card>
  </v-hover>
</template>

<script>
  import { ProjectDetails as CProjectDetails } from '@deip/projects-module';

  export default {
    name: 'ProjectCard',

    components: {
      CProjectDetails
    },

    props: {
      project: {
        type: Object,
        required: true
      }
    }
  };
</script>
