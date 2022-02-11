<template>
  <div v-if="ready">
    <v-toolbar v-if="canEdit">
      <v-spacer />
      <v-btn
        text
        color="primary"
        small
        :to="{name: 'projects.edit'}"
        class="align-self-center"
      >
        <v-icon left>
          mdi-pencil-outline
        </v-icon>
        {{ $t('projects.details.edit') }}
      </v-btn>
    </v-toolbar>

    <c-project-details
      v-if="schema"
      :project="project"
      :schema="schema"
      :schema-data="schemaData"
      class="flex-grow-1"
    />
  </div>
</template>

<script>
  import { ProjectDetails as CProjectDetails } from '@deip/projects-module';

  import { rolesFactory } from '@/mixins';

  export default {
    name: 'ProjectDetails',

    components: {
      CProjectDetails
    },

    mixins: [rolesFactory('teamId')],

    props: {
      projectId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        ready: false
      };
    },

    computed: {
      teamId() {
        return this.project.teamId;
      },

      project() {
        return this.projectId ? this.$store.getters['projects/one'](this.projectId) : {};
      },

      schema() {
        return this.$layouts.getMappedData('project.details')?.value;
      },

      schemaData() {
        return {
          crowdfundingWidget: {
            projectId: this.projectId,
            canUserStartCrowdfunding: this.canUserStartCrowdfunding,
            startCrowdfundingLink: { name: 'projects.crowdfunding.create' },
            investLink: { name: 'projects.crowdfunding.invest' }
          },
          projectNftWidget: {
            nfts: this.project.nfts,
            canUserIssueTokens: this.$$isTeamAdmin
          }
        };
      },

      canUserStartCrowdfunding() {
        return this.$$isTeamAdmin && this.project.nfts.length > 0;
      },

      canEdit() {
        return this.$$isTeamAdmin;
      }
    },

    created() {
      this.getProject();
    },

    methods: {
      async getProject() {
        if (this.projectId) {
          try {
            await this.$store.dispatch('projects/getOne', this.projectId);
          } catch (error) {
            console.error(error);
          }
        }
        this.ready = true;
      }
    }
  };
</script>
