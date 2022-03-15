<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  /**
   * Project content data provider
   */
  export default defineComponent({
    name: 'ProjectContentDataProvider',
    props: {
      /**
       * Tag name
       * @example 'div'
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * Project id
       */
      projectId: {
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

        if (this.projectId) {
          filter.projectId = this.projectId;
        }

        return filter;
      },
      /**
       * Get computed content list by filter
       */
      contentList() {
        return this.$store.getters['projectContent/list'](this.getterFilter);
      },
      /**
       * Get computed slot properties
       */
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
        /**
         * Triggers when the content list is ready
         *
         * @property {Array.<Object>} contentList
         */
        this.$emit('ready', this.contentList);
      },
      /**
       * Get content
       */
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
