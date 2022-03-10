<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(restore)"
    >
      <ve-stack :gap="formGap">
        <slot name="prepend" />

        <ve-stack :gap="fieldsGap">
          <validation-provider
            v-slot="{ errors }"
            :name="emailLabel"
            rules="required"
          >
            <v-text-field
              v-model="formModel.email"
              :label="emailLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
            />
          </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            :name="messageLabel"
            rules="required"
          >
            <v-textarea
              v-model="formModel.message"
              :label="messageLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
              no-resize
              rows="4"
            />
          </validation-provider>
        </ve-stack>

        <ve-stack :gap="submitGap">
          <v-btn
            type="submit"
            color="primary"
            block
            depressed
            :disabled="invalid || loading"
            :loading="loading"
          >
            {{ submitLabel }}
          </v-btn>
        </ve-stack>

        <slot name="append" />
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { VeStack } from '@deip/vue-elements';

  /**
  * Component for restore user password
  * @requires VeStack
  */
  export default {
    name: 'AuthPasswordRestore',

    components: { VeStack },

    props: {
      /**
       * Label for user email field
       * @example "email"
       */
      emailLabel: {
        type: String,
        default() { return this.$t('module.auth.email'); }
      },
      /**
       * Label for message field
       * @example "message"
       */
      messageLabel: {
        type: String,
        default() { return this.$t('module.auth.message'); }
      },
      /**
       * Label for submit restore button
       * @example "restore"
       */
      submitLabel: {
        type: String,
        default() { return this.$t('module.auth.restore'); }
      },
      /**
       * Gap for restore form
       */
      formGap: {
        type: [String, Number],
        default: 48
      },
      /**
       * Gap between form fields
       */
      fieldsGap: {
        type: [String, Number],
        default: 8
      },
      /**
       * Gap between fields and submit button
       */
      submitGap: {
        type: [String, Number],
        default: 16
      },
      /**
       * Object that includes various properties that will be applied
       * to the fields in addition to the properties of this component
       */
      fieldsProps: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        loading: false,
        formModel: {
          email: '',
          message: ''
        }
      };
    },

    methods: {
      /**
       * Recover your password by receiving it by email
       * This method is not yet available
       */
      restore() {
      }
    }
  };
</script>
