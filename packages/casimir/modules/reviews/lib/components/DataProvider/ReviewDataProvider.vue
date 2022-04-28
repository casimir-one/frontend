<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'ReviewDataProvider',
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      contentId: {
        type: String,
        default: null
      },
      projectId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        loading: false,
        ready: false
      };
    },

    computed: {
      reviews() {
        const filter = (this.projectId) ? { projectId: this.projectId }
          : { projectContentId: this.contentId };
        return this.$store.getters['reviews/list'](filter);
      },

      slotProps() {
        return {
          loading: this.loading,
          ready: this.ready,
          reviews: this.reviews
        };
      }
    },

    created() {
      this.getReviews();
    },

    methods: {
      handleReady() {
        this.ready = true;
        this.$emit('ready', this.reviews);
      },

      async getReviews() {
        this.loading = true;

        try {
          if (this.contentId) {
            await this.$store.dispatch('reviews/getReviewsByContent', this.contentId);
          } else await this.$store.dispatch('reviews/getReviewsByProject', this.projectId);
          this.handleReady();
        } catch (error) {
          console.error(error);
        }

        this.loading = false;
      }
    }
  });
</script>
