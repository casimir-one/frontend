<template>
  <vex-section>
    <ve-stack gap="32">
      <div v-for="(item, index) of reviewContent.data" :key="index">
        <div class="text-overline text--secondary">
          {{ $t('module.reviews.details.question') }}
        </div>
        <div class="text-h6 mb-4">
          {{ item.question }}
        </div>
        <div v-html="item.answer" />
      </div>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VeStack } from '@deip/vue-elements';
  import { VexSection } from '@deip/vuetify-extended';

  export default {
    name: 'ReviewDetails',
    components: {
      VeStack,
      VexSection
    },

    props: {
      reviewId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        reviewContent: {},
        domains: []
      };
    },

    computed: {
      review() {
        return this.$store.getters['reviews/one'](this.reviewId);
      }
    },
    created() {
      this.getReview();
    },

    methods: {
      async getReview() {
        try {
          await this.$store.dispatch('reviews/getReviewDetails', this.reviewId)
            .then(() => {
              const cnt = this.review.content;
              this.reviewContent = {
                data: JSON.parse(cnt).map((item) => ({
                  ...item,
                  ...{
                    answer: item.answer.replace(/<p><br><\/p>/gm, '')
                  }
                }))

              };
            });
        } catch (error) {
          console.error(error);
        }
      }

    }
  };
</script>
