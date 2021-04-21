<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  export default {
    name: 'ProjectsDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },

      scope: {
        type: String,
        default: 'projects'
      },
      type: {
        type: String,
        default: 'all'
      },

      username: {
        type: String,
        default: null
      },
      teamId: {
        type: String,
        default: null
      },
      tenantId: {
        type: String,
        default: null
      },
      projects: {
        type: Array,
        default: () => []
      },

      filterItems: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        loading: false,
        ready: false
      };
    },

    computed: {
      getterFilter() {
        const filter = {
          ...this.filterItems
        };

        if (this.username) {
          filter['+members'] = this.username;

          switch (this.type) {
            case 'following':
              filter['+externalId'] = this.projects;
              break;
            case 'public':
              filter.isPrivate = false;
              break;
            case 'teams':
              filter.researchGroup = { isPersonal: false };
              break;
            case ' personal':
              filter.researchGroup = { isPersonal: true };
              break;
            default:
              break;
          }
        } else if (this.teamId) {
          filter.researchGroup = {
            external_id: this.teamId
          };
        } else if (this.tenantId) {
          filter.tenantId = this.tenantId;
        } else {
          filter.isPrivate = false;
        }

        return filter;
      },

      projectsList() {
        return this.$store.getters['projects/list'](this.getterFilter);
      },

      slotProps() {
        return {
          projects: this.projectsList,

          loading: this.loading,
          ready: this.ready
        };
      }
    },

    created() {
      this.loadProjects();
    },

    methods: {
      loadProjects() {
        this.loading = true;

        const {
          scope, type, username, teamId, tenantId, filterItems
        } = this;

        const payload = {
          scope,
          type,
          username,
          teamId,
          tenantId
        };

        if (filterItems) {
          payload.filter = filterItems;
        }

        this.$store.dispatch('projects/getProjects', payload)
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.projectsList);
          });
      }
    }
  };
</script>
