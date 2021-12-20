<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'ProjectContentDraftsDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },

      projectId: {
        type: String,
        required: true
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

      drafts() {
        return this.$store.getters['projectContentDraft/list'](this.getterFilter);
      },

      slotProps() {
        return {
          drafts: this.drafts,

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
        this.$emit('ready', this.drafts);
      },

      async getContent() {
        this.loading = true;

        try {
          await this.$store.dispatch('projectContentDraft/getListByProjectId', this.projectId);
          this.handleReady();
        } catch (error) {
          console.error(error);
        }

        this.loading = false;
      }
    }
  });
</script>
