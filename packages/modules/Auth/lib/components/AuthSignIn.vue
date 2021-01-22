<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signIn)"
    >
      <slot name="prepend"/>

      <vex-stack gutter="16">
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
          />
        </validation-provider>

        <v-btn
          type="submit"
          color="primary"
          block
          :disabled="invalid || loading"
          :loading="loading"
        >
          {{ submitLabel }}
        </v-btn>
        <div class="text-center">
          <router-link :to="{}" class="font-weight-medium text-decoration-none">
            Забыли пароль?
          </router-link>
        </div>
        <div class="text-center">
          Еще нет аккаунта?
          <router-link :to="{ name: 'signUp' }" class="font-weight-medium text-decoration-none">
            Зарегистрируйтесь
          </router-link>
        </div>

      </vex-stack>

      <slot name="append"/>
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
    submitLabel: {
      type: String,
      default: 'Sign in'
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

      this.$store.dispatch('Auth/signIn', this.formModel)
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
