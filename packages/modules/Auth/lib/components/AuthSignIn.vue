<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signIn)"
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
            :name="passwordLabel"
            rules="required"
          >
            <vex-password-input
              v-model="formModel.password"
              :label="passwordLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
              counter
            >
              <template #counter>
                <div class="text-caption">
                  <router-link :to="{}" class="text-decoration-none">
                    {{ passwordRestoreLabel }}
                  </router-link>
                </div>
              </template>
            </vex-password-input>
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

          <slot name="to-register">
            <div class="text-center">
              No accoutn?
              <router-link :to="{ name: 'signUp' }" class="font-weight-medium text-decoration-none">
                Sign up
              </router-link>
            </div>
          </slot>
        </vex-stack>

        <slot name="append"/>

      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
export default {
  name: 'AuthSignIn',

  props: {
    usernameLabel: {
      type: String,
      default: 'Username'
    },
    passwordLabel: {
      type: String,
      default: 'Password'
    },
    passwordRestoreLabel: {
      type: String,
      default: 'Forgot password?'
    },
    submitLabel: {
      type: String,
      default: 'Sign in'
    },

    formGutter: {
      type: [String, Number],
      default: 48
    },

    fieldsGutter: {
      type: [String, Number],
      default: 8
    },

    submitGutter: {
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
        username: '',
        password: ''
      }
    };
  },
  mounted() {
    document.body.click(); // workaround chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=1166619
  },
  methods: {
    signIn() {
      this.loading = true;

      this.$store.dispatch('auth/signIn', this.formModel)
        .then(() => {
          this.$notifier.showSuccess('You are successfully logged in.');
          this.$router.push({ name: this.$authRedirectRouteName })
        })
        .catch((error) => {
          this.$notifier.showError(error);
        })
        .finally(() => {
          this.loading = false;
        });
      ;
    }
  }
};
</script>
