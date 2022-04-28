<template>
  <vex-block>
    <template #title>
      <v-badge
        :content="reviews.length"
        :value="reviews.length"
      >
        {{ $t('module.reviews.reviewsList.reviews') }}
      </v-badge>
    </template>

    <v-divider />

    <template v-if="ready">
      <div>
        <template v-for="(review, index) of reviews">
          <ve-stack :key="`review-${review._id}`" class="text-body-2" no-gutters>
            <vex-block>
              <v-row>
                <v-col cols="12" md="6">
                  <users-list
                    :users="review.author"
                    view-type="stack"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <template v-if="getContentByReview(review.projectContentId)">
                    <div class="text-caption text--secondary">
                      <span class="font-weight-medium">Review to:</span>
                      {{ getProjectContentType(
                        getContentByReview(review.projectContentId).contentType) }}
                    </div>
                    <div>
                      <span>
                        {{ getContentByReview(review.projectContentId).title }}
                      </span>
                    </div>
                  </template>
                </v-col>
              </v-row>
            </vex-block>

            <vex-block>
              <template #title>
                <div class="text-caption text--secondary font-weight-medium">
                  {{ $t('module.reviews.reviewsList.assessment') }}
                </div>
              </template>

              <review-details
                :review-id="review._id"
              />

              <div v-if="review.supporters.length">
                <v-tooltip tag="div" bottom>
                  <template #activator="{ on }">
                    <div class="d-flex justify-end" v-on="on">
                      <div class="half-bold align-self-center pr-2">
                        {{ review.supporters.length }}
                      </div>
                      <v-icon>group_add</v-icon>
                    </div>
                  </template>
                  <div v-if="review.supporters.length">
                    {{ $t('module.reviews.reviewsList.expertsSupp',
                          { supportersCount: review.supporters.length }) }}
                  </div>
                </v-tooltip>
              </div>

              <review-assessment
                :value="getScores(review.assessment.model.scores)"
                readonly
                :content-type="getContentByReview(review.projectContentId).contentType"
              />

              <review-vote
                :review="review"
                :team-id="project.teamId"
                @success="handleVoteSuccess"
                @error="handleVoteError"
              />
            </vex-block>
          </ve-stack>

          <v-divider
            v-if="index < reviews.length - 1"
            :key="`review-d-${index}`"
            class="my-6"
          />
        </template>
      </div>
      <v-divider />
    </template>
  </vex-block>
</template>

<script>
  import { PROJECT_CONTENT_TYPES } from '@deip/constants';
  import { UsersList } from '@deip/users-module';
  import { VeStack } from '@deip/vue-elements';
  import { VexBlock } from '@deip/vuetify-extended';
  import ReviewDetails from '../Details/ReviewDetails';
  import ReviewVote from '../Vote/ReviewVote';
  import ReviewAssessment from '../Assessment/ReviewAssessment';

  export default {
    name: 'ReviewsList',
    components: {
      ReviewAssessment,
      VeStack,
      ReviewDetails,
      VexBlock,
      UsersList,
      ReviewVote
    },

    props: {
      projectId: {
        type: String,
        default: null
      },
      reviews: {
        type: Array,
        default: null
      },
      ready: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      project() {
        return this.$store.getters['projects/one'](this.projectId);
      }
    },

    created() {
      this.getData();
    },

    methods: {
      getContentByReview(id) {
        return this.$store.getters['projectContent/one'](id);
      },
      getData() {
        return Promise.all([
          this.$store.dispatch('projectContent/getListByProjectId', this.projectId),
          this.$store.dispatch('projects/getOne', this.projectId)
        ]);
      },

      getProjectContentType(type) {
        return this.$t(`module.projectContent.types.${PROJECT_CONTENT_TYPES[type]}`);
      },

      handleVoteSuccess() {
        this.$notifier.showSuccess(this.$t('module.reviews.vote.success'));
      },

      handleVoteError(err) {
        this.$notifier.showError(
          err.response && err.response.data
            ? err.response.data
            : this.$t('module.reviews.vote.error')
        );
      },

      getScores(scores) {
        return Array.isArray(scores) ? {} : scores;
      }

    }
  };
</script>
