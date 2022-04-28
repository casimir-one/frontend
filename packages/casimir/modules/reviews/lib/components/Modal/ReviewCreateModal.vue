<template>
  <div>
    <vex-dialog
      v-model="dialog"
      :title="$t('module.reviews.create.modal.title')"
      :button-true-text="$t('module.reviews.create.modal.buttonText')"
      @click:confirm="createReview"
    >
      <v-form>
        <project-content-selector
          v-model="contentId"
          :project-id="projectId"
          :label="$t('module.reviews.create.modal.select')"
        />
      </v-form>
    </vex-dialog>
  </div>
</template>

<script>
  import { ProjectContentSelector } from '@deip/project-content-module';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { VexDialog } from '@deip/vuetify-extended';

  export default {
    name: 'ReviewCreateModal',

    components: {
      ProjectContentSelector,
      VexDialog
    },

    props: {
      projectId: {
        type: String,
        default: null
      },
      value: Boolean
    },

    data() {
      return {
        contentId: null
      };
    },

    computed: {
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          /** Triggers after a value is modified by the user
           *
           * @property {boolean} value
           */
          this.$emit('input', value);
        }
      }
    },

    methods: {
      createReview() {
        this.$emit('select', this.contentId);
        this.dialog = false;
      }

    }
  };
</script>
