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
  import { wrapInArray } from '@deip/toolbox';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'TeamsDataProvider',
    props: {
      /**
       * Tag name
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * Team list
       */
      teams: {
        type: [Array, String],
        default: () => ([])
      },
      /**
       * Filter for items
       */
      filterItems: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        loading: false,
        ready: false,
        disabled: false
      };
    },

    computed: {
      /**
       * Get computed filter for items
       */
      getterFilter() {
        const filter = { ...this.filterItems };

        if (this.teams && wrapInArray(this.teams).length > 0) {
          filter['+_id'] = this.teams;
        }

        return filter;
      },
      /**
       * Get computed team list
       */
      teamsList() {
        return this.$store.getters['teams/list'](this.getterFilter);
      },
      /**
       * Get computed binding slot properties
       */
      slotProps() {
        return {
          teams: this.teamsList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.loadTeams();
    },

    methods: {
      /**
       * Load team list
       */
      loadTeams() {
        this.loading = true;

        this.$store.dispatch('teams/getList', {
          teams: wrapInArray(this.teams)
        })
          .then(() => {
            this.loading = false;
            this.ready = true;
            /**
             * Triggers when team list is ready
             *
             * @type {Array.<Object>}
             */
            this.$emit('ready', this.teamsList);
          });
      }
    }
  });
</script>
