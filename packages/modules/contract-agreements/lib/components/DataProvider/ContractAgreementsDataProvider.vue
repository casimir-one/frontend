<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>

  export default {
    name: 'ContractAgreementsDataProvider',

    props: {
      tag: {
        type: String,
        default: 'div'
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
      contracts() {
        return this.$store.getters['contractAgreements/list'](this.filterItems);
      },

      partyIds() {
        const parties = this.contracts
          .reduce((acc, current) => [...acc, ...current.parties], []);
        return [...new Set(parties)];
      },

      parties() {
        const users = this.$store.getters['users/list']({ username: this.partyIds });
        const teams = this.$store.getters['teams/list']({ entityId: this.partyIds });
        return [
          ...users.map((u) => ({ ...u, type: 'user' })),
          ...teams.map((t) => ({ ...t, type: 'team' }))
        ];
      },

      slotProps() {
        return {
          contracts: this.contracts,
          parties: this.parties,

          loading: this.loading,
          ready: this.ready
        };
      }
    },

    created() {
      this.getContracts();
    },

    methods: {
      getContracts() {
        const {
          parties,
          type,
          status,
          creator
        } = this.filterItems;
        this.loading = true;

        this.$store.dispatch('contractAgreements/getList', {
          parties,
          type,
          status,
          creator
        })
          .then(() => this.getParties())
          .then(() => {
            this.ready = true;

            this.$emit('ready', { contracts: this.contracts, parties: this.parties });
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      getParties() {
        return Promise.all([
          this.$store.dispatch('users/getList', { users: this.partyIds }),
          this.$store.dispatch('teams/getList', { teams: this.partyIds })
        ]);
      }
    }
  };
</script>
