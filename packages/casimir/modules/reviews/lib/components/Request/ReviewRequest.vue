<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ }">
      <v-btn
        outlined
        color="primary"
        small
        @click="dialog=true"
      >
        {{ $t('module.reviews.reviewRequest.request') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        {{ $t('module.reviews.reviewRequest.request') }}
      </v-card-title>

      <v-card-text>
        <div v-if="contentId === null">
          <validation-provider
            v-slot="{ errors }"
            name="Content"
            rules="required"
          >
            <project-content-selector
              v-model="formModel.contentId"
              :project-id="projectId"
              :error-messages="errors"
              :label="$t('module.reviews.reviewRequest.selectContent')"
              hide-details="auto"
            />
          </validation-provider>
        </div>

        <validation-provider
          v-slot="{ errors }"
          name="Expert"
          rules="required"
        >
          <users-selector
            v-model="formModel.reviewer"
            v-bind="reviewerConditions"
            :label="$t('module.reviews.reviewRequest.selectExpert')"
            :error-messages="errors"
          />
        </validation-provider>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <ve-stack flow="column" :gap="8">
          <v-btn
            color="primary"
            text
            @click="handleCancelClick"
          >
            {{ $t('module.reviews.reviewRequest.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="createRequest"
          >
            {{ $t('module.reviews.reviewRequest.confirm') }}
          </v-btn>
        </ve-stack>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { UsersSelector } from '@deip/users-module';
  import { ProjectContentSelector } from '@deip/project-content-module';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'ReviewRequest',
    components: {
      ProjectContentSelector,
      UsersSelector,
      VeStack
    },

    props: {
      reviewerConditions: {
        type: Object,
        default: () => ({})
      },
      projectId: {
        type: String,
        default: null
      },
      contentId: {
        type: String,
        default: null
      }
    },

    data() {
      const formModel = {
        contentId: this.contentId ? this.contentId : null,
        reviewer: null
      };
      return {
        dialog: false,
        loading: false,
        formModel
      };
    },

    methods: {
      handleCancelClick() {
        this.dialog = false;
        this.$emit('cancel');
      },

      async createRequest() {
        this.loading = true;
        const payload = {
          projectContentId: this.formModel.contentId,
          expert: this.formModel.reviewer
        };

        try {
          const req = await this.$store.dispatch('reviewRequests/createRequest', payload);
          this.emitSuccess(req._id);
        } catch (err) {
          this.emitError(err);
        } finally {
          this.loading = false;
          this.dialog = false;
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
