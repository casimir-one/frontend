<template>
  <c-project-content-list
    :project-id="projectId"
    @click-row="handleClickRow"
  />
</template>

<script>
  import { ProjectContentList as CProjectContentList } from '@deip/project-content-module';

  export default {
    name: 'ProjectContentList',

    components: {
      CProjectContentList
    },

    props: {
      projectId: {
        type: String,
        required: true
      }
    },

    methods: {
      handleClickRow(content) {
        this.$router.push({ name: 'projects.content.details', params: { projectId: this.projectId, contentId: content._id } });
      }
    }
  };
</script>
