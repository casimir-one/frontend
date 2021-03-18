<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(restore)"
    >
      <vex-stack :gutter="formGutter">
        <slot name="prepend"/>

        <vex-stack :gutter="fieldsGutter">
          <validation-provider
            v-slot="{ errors }"
            :name="usernameLabel"
            rules="required"
          >
            <v-text-field
              v-model="formModel.username"
              :label="usernameLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
            />
          </validation-provider>

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
        </vex-stack>

        <vex-stack :gutter="submitGutter">
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
        </vex-stack>

        <slot name="append"/>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
export default {
  name: 'AuthPasswordRestore',
  props: {
    usernameLabel: {
      type: String,
      default: 'Username'
    },
    emailLabel: {
      type: String,
      default: 'Email'
    },
    messageLabel: {
      type: String,
      default: 'Message'
    },
    submitLabel: {
      type: String,
      default: 'Restore'
    },

    formGutter: {
      type: [ String, Number ],
      default: 48
    },

    fieldsGutter: {
      type: [ String, Number ],
      default: 8
    },

    submitGutter: {
      type: [ String, Number ],
      default: 16
    },

    fieldsProps: {
      type: Object,
      default: () => ({
        outlined: true,
      })
    } 
  },

  data() {
    return {
      loading: false,
      formModel: {
        username: '',
        email: '',
        message: '',
      }
    };
  },

  methods: {
    restore() {}
  }
}
</script>
