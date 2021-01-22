<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signUp)"
    >
      <slot name="prepend" />

      <input autocomplete="false" name="hidden" type="text" style="display:none;" />

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

        <v-radio-group class="ma-0 pa-0" v-model="formModel.roles">
          <v-radio label="Студент" :value="1" />
          <v-radio label="Инвестор" :value="2" />
        </v-radio-group>

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
          Уже есть аккаунт?
          <router-link :to="{ name: 'signIn' }" class="font-weight-medium text-decoration-none">
            Войдите
          </router-link>
        </div>
      </vex-stack>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  export default {
    name: 'AuthSignUp',

    props: {
      usernameLabel: {
        type: String,
        default: 'Username'
      },
      passwordLabel: {
        type: String,
        default: 'Password'
      },
      emailLabel: {
        type: String,
        default: 'Email'
      },
      submitLabel: {
        type: String,
        default: 'Sign up'
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true,
          autocomplete: 'new-password'
        })
      }
    },

    data() {
      return {
        loading: false,
        formModel: {
          username: '',
          email: '',
          password: '',
          roles: 1
        }
      };
    },
    methods: {
      signUp() {
        this.loading = true;

        this.$store.dispatch('Auth/signUp', this.formModel)
          .then(() => {
            this.$router.push({ name: this.$authRedirectRouteName })
          })
          .catch((error) => {
            this.$notifier.showError(error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
