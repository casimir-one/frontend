<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signUp)"
    >
      <input autocomplete="false" name="hidden" type="text" style="display:none;"/>

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

          <!-- TEMP -->
          <v-radio-group hide-details class="ma-0 pa-0" v-model="formModel.roles">
            <v-radio label="Студент" :value="1"/>
            <v-radio label="Инвестор" :value="2"/>
          </v-radio-group>

          <!-- END TEMP -->
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
              Has account?
              <router-link :to="{ name: 'signIn' }" class="font-weight-medium text-decoration-none">
                Sign in
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
  import { VexStack, VexPasswordInput } from '@deip/vuetify-extended';

  export default {
    name: 'AuthSignUp',

    components: {
      VexStack,
      VexPasswordInput
    },

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

        this.$store.dispatch('auth/signUp', this.formModel)
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
