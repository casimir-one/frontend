<template>
  <validation-observer
    v-slot="{ invalid, handleSubmit }"
    ref="observer"
    tag="div"
    style="min-width: 0px"
  >
    <ve-raw-display
      v-if="$env.NODE_ENV === 'development'"
      :value="formData.attributes"
      class="mb-6"
    />

    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <ve-stack :gap="32">
        <layout-renderer
          v-if="schema.length"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
        />

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="primary"
            text
            :disabled="loading || disabled"
            @click="handleCancelClick"
          >
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            depressed
            :disabled="disabled || untouched || invalid"
            :loading="loading"
          >
            {{ submitLabelText }}
          </v-btn>
        </div>
      </ve-stack>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  import { attributedFormFactory, LayoutRenderer } from '@casimir/layouts-module';
  import { ViewMode } from '@casimir/platform-core';
  import { VeRawDisplay, VeStack } from '@casimir/vue-elements';
  import { defineComponent } from '@casimir/platform-util';

  export default defineComponent({
    name: 'TeamForm',

    components: {
      VeStack,
      VeRawDisplay,

      LayoutRenderer
    },

    mixins: [attributedFormFactory('team', 'team')],

    props: {
      /**
       * Add default project to team
       * @values 'true','false'
      */
      withDefaultProject: {
        type: Boolean,
        default: false
      },
      /**
       * Cancel label
       *
       * @example 'Cancel'
      */
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.teams.form.cancel');
        }
      },
      /**
       * Submit label
       *
       * @example 'Submit'
       */
      submitLabel: {
        type: String,
        default() {
          return null;
        }
      }
    },

    computed: {
      /**
       * Get computed text for submit label
       */
      submitLabelText() {
        if (this.submitLabel) {
          return this.submitLabel;
        }

        return this.mode === ViewMode.CREATE
          ? this.$t('module.teams.form.create')
          : this.$t('module.teams.form.update');
      }
    },

    methods: {
      /**
       * Triggers when user submits form
       *
       * @event submit
       */
      async onSubmit() {
        this.loading = true;

        if (this.mode === ViewMode.CREATE) {
          await this.createTeam();
        } else if (this.mode === ViewMode.EDIT) {
          await this.updateTeam();
        }

        this.loading = false;
      },
      /**
       * Create team
       */
      async createTeam() {
        try {
          const team = await this.$store.dispatch(
            'teams/create',
            {
              isCreateDefaultProject: this.withDefaultProject,
              initiator: this.$currentUser,
              ...this.lazyFormData
            }
          );
          this.emitSuccess(team._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      /**
       * Update team
       */
      async updateTeam() {
        try {
          const team = await this.$store.dispatch(
            'teams/update',
            {
              initiator: this.$currentUser,
              ...this.lazyFormData
            }
          );
          this.emitSuccess(team._id);
        } catch (err) {
          this.emitError(err);
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
        /**
       * Triggers when error occurs
       *
       * @property {Error} error
       */
        this.$emit('error', err);
      },
      handleCancelClick() {
        /**
         * Triggers by clicking on cancel button
         */
        this.$emit('cancel');
      }
    }
  });
</script>
