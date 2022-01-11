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

  export default {
    name: 'AuthPasswordRestore',

    components: { VeStack },

    props: {
      emailLabel: {
        type: String,
        default() { return this.$t('module.auth.email'); }
      },
      messageLabel: {
        type: String,
        default() { return this.$t('module.auth.message'); }
      },
      submitLabel: {
        type: String,
        default() { return this.$t('module.auth.restore'); }
      },

      formGap: {
        type: [String, Number],
        default: 48
      },

      fieldsGap: {
        type: [String, Number],
        default: 8
      },

      submitGap: {
        type: [String, Number],
        default: 16
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true
        })
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
      restore() {
      }
    }
  };
</script>
