<template>
  <vex-section>
    <ve-stack>
      <vex-section-title
        :title="$t('projects.list.title')"
      />

      <project-cards-list />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VeStack } from '@deip/vue-elements';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { ProjectCardsList } from '@/modules/projects/components/ProjectCardsList';

  export default {
    name: 'ProjectList',

    components: {
      VexSection,
      VexSectionTitle,
      VeStack,
      ProjectCardsList
    }
  };
</script>
