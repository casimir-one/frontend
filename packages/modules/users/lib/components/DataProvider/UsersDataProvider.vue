<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { wrapInArray } from '@deip/toolbox';

  export default {
    name: 'UsersDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },

      users: {
        type: [Array, String],
        default: () => ([])
      },
      teamId: {
        type: String,
        default: null
      },
      tenantId: {
        type: String,
        default: null
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

        if (this.tenantId) {
          filter.tenantId = this.tenantId;
        }
        if (this.teamId) {
          filter['+teams'] = this.teamId;
        }
        if (this.users && wrapInArray(this.users).length > 0) {
          filter['+username'] = this.users;
        }

        return filter;
      },

      usersList() {
        return this.$store.getters['users/list'](this.getterFilter);
      },

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
      loadUsers() {
        this.loading = true;

        this.$store.dispatch('users/get', {
          users: wrapInArray(this.users),
          teamId: this.teamId,
          tenantId: this.tenantId
        })
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.usersList);
          });
      }
    }
  };
</script>
