<template>
  <component :is="tag">
    <!--
      @slot
      @binding {Object} slotProps
    -->
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'ProjectsDataProvider',
    props: {
      /**
       * Tag name
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * Scope name
       *
       * @example 'projects'
       */
      scope: {
        type: String,
        default: 'projects'
      },
      /**
       * Type
       *
       * @example 'all'
       */
      type: {
        type: String,
        default: 'all'
      },
      /**
       * Username
       */
      username: {
        type: String,
        default: null
      },
      /**
       * Team id
       */
      teamId: {
        type: String,
        default: null
      },
      /**
       * Portal id
       */
      portalId: {
        type: String,
        default: null
      },
      /**
       * Project list
       */
      projects: {
        type: Array,
        default: () => []
      },
      /**
       * Filter for items
       */
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
      /**
       * Get computed filter for items
       */
      getterFilter() {
        const filter = {
          ...this.filterItems
        };

        if (this.username) {
          filter['+members'] = this.username;

          switch (this.type) {
            case 'following':
              filter['+_id'] = this.projects;
              break;
            case 'public':
              filter.isPrivate = false;
              break;
            default:
              break;
          }
        } else if (this.teamId) {
          filter.teamId = this.teamId;
        } else if (this.portalId) {
          filter.portalId = this.portalId;
        } else {
          filter.isPrivate = false;
        }

        return filter;
      },

      /**
       * Get computed project list
       */
      projectsList() {
        return this.$store.getters['projects/list'](this.getterFilter);
      },

      /**
       * Get computed binding slot properties
       */
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
      /**
       * Load project list
       */
      loadProjects() {
        this.loading = true;

        const {
          scope, type, username, teamId, portalId, filterItems
        } = this;

        const payload = {
          scope,
          type,
          username,
          teamId,
          portalId
        };

        if (filterItems) {
          payload.filter = filterItems;
        }

        this.$store.dispatch('projects/getList', payload)
          .then(() => {
            this.loading = false;
            this.ready = true;

            /**
             * Triggers when project list is ready
             *
             * @type {Array.<Object>}
             */
            this.$emit('ready', this.projectsList);
          });
      }
    }
  });
</script>
