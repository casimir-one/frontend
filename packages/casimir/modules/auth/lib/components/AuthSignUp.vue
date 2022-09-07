<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signUp)"
    >
      <input
        autocomplete="false"
        name="hidden"
        type="text"
        style="display:none;"
      >

      <slot v-bind="binds">
        <slot name="prepend" v-bind="binds" />

        <slot name="fields" v-bind="binds">
          <ve-stack :gap="8" class="mb-7">
            <slot name="prepend-fields" v-bind="binds" />

            <validation-provider
              v-slot="{ errors }"
              :name="emailLabel"
              rules="required|email"
              :debounce="1000"
            >
              <v-text-field
                v-model="formModel.email"
                :label="emailLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
              />
            </validation-provider>

            <vex-password-repeat-input
              v-model="formModel.password"
              :password-label="passwordLabel"
              :repeat-password-label="repeatPasswordLabel"
              :password-min-lentgh="newPasswordMinLentgh"
              :password-max-lentgh="newPasswordMaxLentgh"
            />

            <slot name="apend-fields" v-bind="binds" />
          </ve-stack>
        </slot>

        <slot name="submit" v-bind="binds">
          <ve-stack :gap="24">
            <v-btn
              type="submit"
              color="primary"
              block
              depressed
              :disabled="invalid || loading || disabled"
              :loading="loading"
            >
              {{ submitLabel }}
            </v-btn>

            <div class="text-center">
              {{ $t('module.auth.haveAccountQuestion') }}
              <router-link
                :to="{
                  name: $store.getters['auth/settings'].signInRouteName
                }"
                class="font-weight-medium text-decoration-none"
              >
                {{ $t('module.auth.signIn') }}
              </router-link>
            </div>
          </ve-stack>
        </slot>

        <slot name="append" v-bind="binds" />
      </slot>
    </v-form>
  </validation-observer>
</template>

<script>
  import { VexPasswordRepeatInput } from '@casimir.one/vuetify-extended';
  import { VeStack } from '@casimir.one/vue-elements';

  /**
  * Component for user registration and login to the application
  */
  export default {
    name: 'AuthSignUp',

    components: {
      VeStack,
      VexPasswordRepeatInput
    },

    props: {
      /**
       * Label for password field
       * @example "password"
       */
      passwordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.password');
        }
      },
      /**
       * Label for repeat password field
       * @example "repeat password"
       */
      repeatPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.repeatPassword');
        }
      },
      /**
       * Label for user email field
       * @example "email"
       */
      emailLabel: {
        type: String,
        default() {
          return this.$t('module.auth.email');
        }
      },
      /**
       * Label for sign up button
       * @example "sign up"
       */
      submitLabel: {
        type: String,
        default() {
          return this.$t('module.auth.signUp');
        }
      },
      /**
       * Object that includes various properties that will be applied
       * to the fields in addition to the properties of this component
       */
      fieldsProps: {
        type: Object,
        default: () => ({
          autocomplete: 'new-password'
        })
      },
      /**
       * Whether the user should be automatically logged in
       * after registration
       * Enabled by default
       */
      autologin: {
        type: Boolean,
        default: true
      },
      /**
       * Array of roles depending on the status of this user
       * in the application
       */
      roles: {
        type: Array,
        default: () => []
      },
      /**
       * Minimum password length
       * Default: 10 characters
       */
      newPasswordMinLentgh: {
        type: Number,
        default: 10
      },
      /**
       * Maximum password length
       * Default: 64 characters
       */
      newPasswordMaxLentgh: {
        type: Number,
        default: 64
      }

    },

    data() {
      return {
        loading: false,
        disabled: false,

        formModel: {
          email: '',
          password: ''
        }
      };
    },

    computed: {
      binds() {
        return {
          formModel: this.formModel,
          signUp: this.signUp
        };
      }
    },

    methods: {
      /**
       * Сhanges the state to show that the data is being loaded and
       * changing the fields is not yet possible.
       * Fires on form submission and
       * @param {boolean} state
       */
      setLoading(state) {
        this.loading = state;
        this.disabled = state;
      },
      /**
       * Success event.
       * Fired on successful form submission
       * @event success
       * @type {Object}
       */
      emitSuccess(data) {
        this.setLoading(false);
        this.$emit('success', data);
      },
      /**
       * Error event.
       * Fires on error form submission
       * @event error
       * @type {Object}
       */
      emitError(error) {
        this.setLoading(false);
        this.$emit('error', error);
      },
      /**
       * User registration
       * Gets called when the user clicks on the submit button
       * Triggers emitSuccess/emitError events and loading screen
       */
      signUp() {
        this.setLoading(true);

        this.$store.dispatch('auth/signUp', { ...this.formModel, ...{ roles: this.roles } })
          .then((res) => {
            if (this.autologin) {
              const { email: username, password } = this.formModel;
              this.$store.dispatch('auth/signIn', { username, password })
                .then(() => this.emitSuccess(res));
            } else {
              this.emitSuccess(res);
            }
          })
          .catch((error) => {
            this.emitError(error.response?.data || error.message);
          });
      }
    }
  };
</script>
