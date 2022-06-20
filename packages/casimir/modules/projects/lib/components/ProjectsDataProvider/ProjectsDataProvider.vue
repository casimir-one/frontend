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
       * Issuer
       */
      issuer: {
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
       * Project ids list
       */
      ids: {
        type: Array,
        default: null
      },
      /**
       * Filter for items
       */
      filterItems: {
        type: Object,
        default: null
      },
      issuedByTeam: {
        type: Boolean,
        default: false
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

        if (this.issuer) filter.issuer = this.issuer;
        if (this.ids && this.ids.length) filter['+_id'] = this.ids;
        if (this.portalId) filter.portalId = this.portalId;

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
          issuer,
          portalId,
          filterItems,
          ids
        } = this;

        const payload = {
          issuer,
          portalId,
          ids,
          filter: filterItems
        };

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
