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
        disabled: false,
      }
    },

    computed: {
      usersList() {
        return this.$store.getters['users/list'](this.filterItems)
      },

      slotProps() {
        return {
          users: this.usersList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        }
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
          tenantId: this.tenantId,
        })
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.usersList);
          });
      },
    }
  }
</script>
