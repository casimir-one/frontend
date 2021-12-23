<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'ProjectContentDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },

      projectId: {
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

        if (this.projectId) {
          filter.projectId = this.projectId;
        }

        return filter;
      },

      contentList() {
        return this.$store.getters['projectContent/list'](this.getterFilter);
      },

      slotProps() {
        return {
          contentList: this.contentList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.getContent();
    },

    methods: {
      handleReady() {
        this.ready = true;
        this.$emit('ready', this.contentList);
      },

      async getContent() {
        this.loading = true;

        try {
          if (this.projectId) {
            await this.$store.dispatch('projectContent/getListByProjectId', this.projectId);
          } else {
            await this.$store.dispatch('projectContent/getList');
          }
          this.handleReady();
        } catch (error) {
          console.error(error);
        }

        this.loading = false;
      }
    }
  });
</script>
