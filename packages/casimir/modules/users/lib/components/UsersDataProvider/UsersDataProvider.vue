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
  import { wrapInArray } from '@casimir.one/toolbox';
  import { defineComponent } from '@casimir.one/platform-util';

  export default defineComponent({
    name: 'UsersDataProvider',
    props: {
      /**
       * Tag name
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * User list
       */
      users: {
        type: [Array, String],
        default: () => ([])
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

        if (this.portalId) {
          filter.portalId = this.portalId;
        }
        if (this.teamId) {
          filter['+teams'] = this.teamId;
        }
        if (this.users && wrapInArray(this.users).length > 0) {
          filter['+_id'] = this.users;
        }

        return filter;
      },
      /**
       * Get computed user list
       */
      usersList() {
        return this.$store.getters['users/list'](this.getterFilter);
      },
      /**
       * Get computed binding slot properties
       */
      slotProps() {
        return {
          users: this.usersList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.loadUsers();
    },

    methods: {
      /**
       * Load user list
       */
      loadUsers() {
        this.loading = true;

        this.$store.dispatch('users/getList', {
          users: wrapInArray(this.users),
          teamId: this.teamId,
          portalId: this.portalId
        })
          .then(() => {
            this.loading = false;
            this.ready = true;
            /**
             * Triggers when user list is ready
             *
             * @type {Array.<Object>}
             */
            this.$emit('ready', this.usersList);
          });
      }
    }
  });
</script>
