<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { wrapInArray } from '@deip/toolbox';

  export default {
    name: 'TeamsDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },

      teams: {
        type: [Array, String],
        default: () => ([])
      },

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
      getterFilter() {
        const filter = { ...this.filterItems };

        if (this.teams && wrapInArray(this.teams).length > 0) {
          filter['+externalId'] = this.teams;
        }

        return filter;
      },

      teamsList() {
        return this.$store.getters['teams/list'](this.getterFilter);
      },

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
      loadTeams() {
        this.loading = true;

        this.$store.dispatch('teams/getList', {
          teams: wrapInArray(this.teams)
        })
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.teamsList);
          });
      }
    }
  };
</script>
