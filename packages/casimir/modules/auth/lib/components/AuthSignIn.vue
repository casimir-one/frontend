<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      ref="formRef"
      :disabled="loading"
      @submit.prevent="handleSubmit(signIn)"
    >
      <slot v-bind="binds">
        <slot name="prepend" v-bind="binds" />

        <slot name="fields" v-bind="binds">
          <ve-stack :gap="8" class="mb-7">
            <validation-provider
              v-slot="{ errors }"
              :name="usernameLabel"
              rules="required"
            >
              <v-text-field
                ref="usernameFieldRef"
                v-model="formModel.username"
                name="username"
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
                ref="passwordFieldRef"
                v-model="formModel.password"
                name="password"
                :label="passwordLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
                counter
              >
                <template #counter>
                  <div class="text-caption">
                    <router-link :to="{name: 'passwordRestore'}" class="text-decoration-none">
                      {{ passwordRestoreLabel }}
                    </router-link>
                  </div>
                </template>
              </vex-password-input>
            </validation-provider>
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
              {{ $t('module.auth.noAccountQuestion') }}
              <router-link :to="{ name: 'signUp' }" class="font-weight-medium text-decoration-none">
                {{ $t('module.auth.signUp') }}
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
  import { VexPasswordInput } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  /**
   * Component for user authorization and login to the application
   */
  export default {
    name: 'AuthSignIn',

    components: {
      VeStack,
      VexPasswordInput
    },

    props: {
      /**
       * Label for username field
       * @example "username"
       */
      usernameLabel: {
        type: String,
        default() { return this.$t('module.auth.username'); }
      },
      /**
       * Label for password field
       * @example "password"
       */
      passwordLabel: {
        type: String,
        default() { return this.$t('module.auth.password'); }
      },
      /**
       * Label for password restore button
       * @example "forgot password?"
       */
      passwordRestoreLabel: {
        type: String,
        default() { return this.$t('module.auth.forgotPasswordQuestion'); }
      },
      /**
       * Label for password submit button
       * @example "sign in"
       */
      submitLabel: {
        type: String,
        default() { return this.$t('module.auth.signIn'); }
      },
      /**
       * Object that includes various properties that will be applied
       * to the fields in addition to the properties of this component.
       */
      fieldsProps: {
        type: Object,
        default: () => ({ })
      }
    },

    data() {
      return {
        loading: false,
        disabled: false,

        formModel: {
          username: '',
          password: ''
        }
      };
    },

    computed: {
      binds() {
        return {
          formModel: this.formModel,
          signIn: this.signIn
        };
      }
    },

    mounted() {
      // selected delay 500ms is a magic number.
      setTimeout(this.activateFieldWhenHasAutofill, 500);
    },

    methods: {
      /**
       * Сhanges the state to show that the data is being loaded and
       * changing the fields is not yet possible.
       * Fires on form submission
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
        this.$emit('success', data);
      },

      /**
       * Error event.
       * Fires on form submission error
       * @event error
       * @type {Object}
       */
      emitError(error) {
        this.$emit('error', error);
      },

      /**
       * Login user
       * Gets called when the user clicks on the submit button
       * Triggers emitSuccess/emitError events and loading spinner
       */
      async signIn() {
        this.setLoading(true);
        try {
          const res = await this.$store.dispatch('auth/signIn', this.formModel);
          this.emitSuccess(res);
        } catch (e) {
          this.emitError(e.message);
        }
        this.setLoading(false);
      },

      /**
       * Solving the problem with displaying a text field
       * when the field has autocomplete for browsers on chromium
       */
      activateFieldWhenHasAutofill() {
        [
          this.$refs.usernameFieldRef,
          this.$refs.passwordFieldRef
        ].forEach((c) => {
          if (c.$el.querySelector(':-webkit-autofill')) {
            // eslint-disable-next-line no-param-reassign
            c.isFocused = true;
          }
        });
      }
    }
  };
</script>
