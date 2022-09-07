<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <ve-raw-display
      v-if="$env.NODE_ENV === 'development'"
      :value="formData"
      class="mb-6"
    />

    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <ve-stack :gap="32">
        <layout-renderer
          v-if="schema.length"
          :key="forceUpdateKey"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
        />

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="loading"
            text
            class="mr-2"
            @click="handleCancelClick"
          >
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="untouched || invalid"
            :loading="loading"
          >
            {{ submitLabelText }}
          </v-btn>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { attributedFormFactory, LayoutRenderer } from '@casimir.one/layouts-module';
  import { VeStack, VeRawDisplay } from '@casimir.one/vue-elements';
  import { ViewMode } from '@casimir.one/platform-core';
  import { defineComponent } from '@casimir.one/platform-util';

  export default defineComponent({
    name: 'UserForm',

    components: {
      LayoutRenderer,
      VeStack,
      VeRawDisplay
    },

    mixins: [attributedFormFactory('user', 'user')],

    props: {
      /**
       * Cancel label
       *
       * @example 'Cancel'
       */
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.users.form.cancel');
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
      },
      // override mixin prop
      /**
       * View mode
       *
       * @example 'Edit'
       */
      mode: {
        type: [String, Number],
        default: ViewMode.EDIT,
        validator(value) {
          return value === ViewMode.EDIT;
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

        return this.$t('module.users.form.update');
      }
    },

    methods: {
      /**
       * Triggers when user submits form
       *
       * @event submit
       */
      async  onSubmit() {
        this.loading = true;

        await this.updateUser();

        this.loading = false;
      },
      /**
       * Update user
       */
      async updateUser() {
        const payload = {
          initiator: this.$currentUser,
          ...this.lazyFormData
        };

        try {
          await this.$store.dispatch('users/update', payload);
          this.emitSuccess();
        } catch (err) {
          this.emitError(err);
        }
      },

      emitSuccess() {
        /**
         * Success event
         */
        this.$emit('success');
      },

      emitError(err) {
        console.error(err);
        /**
       * Triggers when error occurs
       *
       * @property {Error} err
       */
        this.$emit('error', err);
      },
      /**
       * Triggers by clicking on cancel button
       *
       * @event click
       */
      handleCancelClick() {
        this.$emit('cancel');
        this.restoreOldValue(true);
      }
    }
  });
</script>
