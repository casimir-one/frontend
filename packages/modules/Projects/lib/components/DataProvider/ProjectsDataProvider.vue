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

      userName: {
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

      filterItems: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        loading: false,
        ready: false,
      }
    },

    computed: {
      projectsList() {
        return this.$store.getters['projects/list']()
      },

      slotProps() {
        return {
          projects: this.projectsList,

          loading: this.loading,
          ready: this.ready,
        }
      }
    },

    created() {
      this.loadProjects();
    },

    methods: {
      loadProjects() {
        this.loading = true;
        
        const payload = {
          scope: this.scope,
          type: this.type,

          userName: this.userName,
          teamId: this.teamId,
          tenantId: this.tenantId,
        };

        if (this.filterItems) {
          payload.filter = this.filterItems;
        }

        this.$store.dispatch('projects/getProjects', payload)
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.projectsList);
          });
      },
    }
  }
</script>
