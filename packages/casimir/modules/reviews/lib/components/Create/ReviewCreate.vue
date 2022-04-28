<template>
  <vex-section
    title="Submit review"
  >
    <v-form @submit.prevent="publishReview">
      <ve-stack gap="32">
        <ve-stack gap="4">
          <div class="text-overline">
            {{ $t('module.reviews.create.project') }}
          </div>
          <div>
            <span class="font-weight-regular">
              {{ project.title }}
            </span>
          </div>
        </ve-stack>
        <ve-stack gap="4">
          <div class="text-overline">
            {{ $t('module.reviews.create.subject') }}
          </div>
          <div>
            <span class="font-weight-regular">
              {{ $t('module.reviews.create.reviewOn',
                    { title: content.title }) }}
            </span>
          </div>
        </ve-stack>

        <vex-block>
          <div
            v-for="(question, index) of questions"
            :key="index"
          >
            <div class="text-overline text--secondary">
              {{ $t('module.reviews.create.question',
                    { number: index + 1 }) }}
            </div>
            <div class="text-h6 mb-2">
              {{ question }}
            </div>
            <v-text-field
              v-model="formModel.reviewData[index]"
              :label="$t('module.reviews.create.answer')"
              hide-details="auto"
              :disabled="!requestAccepted"
            />
          </div>
        </vex-block>

        <vex-block title="Assesment" title-margin="16">
          <review-assessment
            v-model="formModel.assessmentCriteria"
            :content-type="content.contentType"
            :readonly="!requestAccepted"
            :columns="2"
            :gutter="64"
          />
        </vex-block>
        <v-divider />

        <div class="d-flex align-center">
          <v-switch
            v-model="formModel.confirm"
            :disabled="!requestAccepted"
            :label="$t('module.reviews.create.switchLabel')"
            class="ma-0 pa-0"
            hide-details="auto"
          />
          <v-spacer />
          <template v-if="requestAccepted">
            <ve-stack flow="column" :gap="8">
              <v-btn
                color="primary"
                text
                :disabled="loading"
                :loading="loading"
                @click="handleCancelClick"
              >
                {{ $t('module.reviews.create.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :disabled="isReviewPublishingDisabled || loading || invalid"
                :loading="loading"
              >
                {{ $t('module.reviews.create.publish') }}
              </v-btn>
            </ve-stack>
          </template>

          <template v-else>
            <v-btn
              color="primary"
              text
              @click="rejectReviewRequest"
            >
              {{ $t('module.reviews.create.reject') }}
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              :disabled="loading"
              :loading="loading"
              @click="acceptReviewRequest"
            >
              <!-- Publish -->
              {{ $t('module.reviews.create.accept') }}
            </v-btn>
          </template>
        </div>
      </ve-stack>
    </v-form>
  </vex-section>
</template>

<script>
  import { VexBlock, VexSection } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { REVIEW_REQUEST_STATUS, ASSESSMENT_CRITERIA_TYPE } from '@deip/constants';
  import { reviewsMixin } from '../../mixins/mixins';

  import ReviewAssessment from '../Assessment/ReviewAssessment';

  export default {
    name: 'ReviewCreate',
    components: {
      ReviewAssessment,
      VeStack,
      VexBlock,
      VexSection
    },
    mixins: [reviewsMixin],

    props: {
      project: {
        type: Object,
        default: null
      },
      content: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        formModel: {
          reviewData: [],
          assessmentCriteria: {},
          confirm: false
        },
        loading: false,

        requestAccepted: true,
        requestData: {}
      };
    },

    computed: {
      questions() {
        const { reviewQuestions } = this.$store.getters['currentPortal/data'].profile
          .settings;
        return reviewQuestions ? reviewQuestions.map((q) => q.question) : [];
      },

      requestList() {
        return this.$store.getters['reviewRequests/list'];
      },

      isReviewPublishingDisabled() {
        const assessmentCriterias = this.$$getAssessmentCriterias(this.content.contentType);
        const { assessmentCriteria } = this.formModel;
        return assessmentCriterias
          .some((criteria) => assessmentCriteria[criteria.id] === undefined
            || assessmentCriteria[criteria.id] === 0);
      },

      reviewData() {
        return this.questions.map((q, i) => ({
          question: q,
          answer: this.formModel.reviewData[i]
        }));
      }
    },

    watch: {
      questions: {
        handler(val) {
          this.formModel.reviewData.push(...val.map(() => []));
        }
      }
    },

    created() {
      this.getRequests();
    },

    methods: {
      async getRequests() {
        try {
          await this.$store.dispatch('reviewRequests/getRequestListByExpert', {
            username: this.$currentUser.username,
            status: REVIEW_REQUEST_STATUS.PENDING
          });

          const request = this.requestList.find((r) => r.projectContentId === this.content._id);
          if (request) {
            this.requestAccepted = false;
            this.requestData = request;
          }
        } catch (error) {
          console.error(error);
        }
      },

      acceptReviewRequest() {
        this.requestAccepted = true;
      },

      rejectReviewRequest() {
        this.loading = true;
        return this.$store.dispatch('reviews/rejectReviewRequest', this.requestData._id);
      },

      handleCancelClick() {
        this.$emit('cancel');
      },

      async publishReview() {
        this.loading = true;

        const { assessmentCriteria } = this.formModel;
        const scores = Object.keys(assessmentCriteria)
          .reduce((sc, key) => {
            const val = assessmentCriteria[key];
            // eslint-disable-next-line no-param-reassign
            sc[parseInt(key)] = parseInt(val);
            return sc;
          }, {});
        const domains = [];
        const assessment = { type: ASSESSMENT_CRITERIA_TYPE.NOVELTY, scores };

        const payload = {
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          data: {
            projectContentId: this.content._id,
            content: JSON.stringify(this.reviewData),
            assessment,
            domains
          }
        };

        try {
          const rev = await this.$store.dispatch('reviews/create', payload);
          this.emitSuccess(rev._id);
        } catch (err) {
          this.emitError(err);
        } finally {
          this.loading = false;
        }
      },

      emitSuccess(id) {
        /**
         * Success event
         *
         * @property {string} id
         */
        this.$emit('success', id);
      },

      emitError(err) {
        console.error(err);
        /**
       * Triggers when error occurs
       *
       * @property {Error} err
       */
        this.$emit('error', err);
      }

    }
  };
</script>
