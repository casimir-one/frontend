<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      ref="changePasswordForm"
      :disabled="loading"
      @submit.prevent="handleSubmit(updatePassword)"
    >
      <slot v-bind="binds">
        <slot name="prepend" v-bind="binds" />

        <slot name="fields" v-bind="binds">
          <ve-stack :gap="8" class="mb-7">
            <!-- original password -->

            <validation-provider
              v-slot="{ errors }"
              :name="oldPasswordLabel"
              rules="required"
            >
              <vex-password-input
                v-model="formModel.oldPassword"
                :label="oldPasswordLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
              />
            </validation-provider>

            <!-- new password -->

            <vex-password-repeat-input
              v-model="formModel.newPassword"
              :password-label="newPasswordLabel"
              :repeat-password-label="repeatPasswordLabel"
              :password-min-lentgh="newPasswordMinLentgh"
              :password-max-lentgh="newPasswordMaxLentgh"
            />
          </ve-stack>
        </slot>

        <div class="d-flex align-center">
          <v-spacer />
          <slot name="submit" v-bind="binds">
            <ve-stack flow="column" :gap="8">
              <v-btn
                text
                color="primary"
                :disabled="loading"
                @click="cleanForm"
              >
                {{ cancelBtn }}
              </v-btn>
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
            </ve-stack>
          </slot>
        </div>
        <slot name="append" v-bind="binds" />
      </slot>
    </v-form>
  </validation-observer>
</template>
<script>
  import { VexPasswordInput, VexPasswordRepeatInput } from '@casimir/vuetify-extended';
  import { VeStack } from '@casimir/vue-elements';

  /**
  * Component for change user password
  */
  export default {
    name: 'AuthChangePassword',
    components: {
      VeStack,
      VexPasswordInput,
      VexPasswordRepeatInput
    },
    props: {
      /**
      * Label for old password field
      * @example "password"
      */
      oldPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.oldPasswordLabel');
        }
      },
      /**
      * Label for new password field
      * @example "new password"
      */
      newPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.newPasswordLabel');
        }
      },
      /**
      * Label for repeat password field
      * @example "repeat password"
      */
      repeatPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.repeatPasswordLabel');
        }
      },
      /**
      * Label for password submit button
      * @example "change password"
      */
      submitLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.submitBtn');
        }
      },
      /**
      * Label for cancel button
      * @example "cancel"
      */
      cancelBtn: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.cancelBtn');
        }
      },
      /**
      * Сharacter counter
      * Enabled by default
      */
      fieldsProps: {
        type: Object,
        default: () => ({
          counter: true
        })
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
          oldPassword: '',
          newPassword: ''
        }
      };
    },
    computed: {
      binds() {
        return {
          formModel: this.formModel,
          updatePassword: this.updatePassword
        };
      }
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
       * Fires on error form submission
       * @event error
       * @type {Object}
       */
      emitError(error) {
        this.$emit('error', error);
      },
      /**
       * Cancel event.
       * Fires on cancel form submission
       * @event cancel
       */
      cleanForm() {
        this.$emit('cancel');
        this.$refs.changePasswordForm.reset();
        this.$refs.observer.reset();
      },
      /**
       * Update user password
       * Gets called when the user clicks on the submit button
       * Triggers emitSuccess/emitError events and loading spinner
       * Triggers the cleanForm event for a form after an attempt
       * to update a password
       */
      updatePassword() {
        this.setLoading(true);
        return this.$store.dispatch('auth/changePassword', {
          initiator: this.$currentUser,
          data: this.formModel
        })
          .then((data) => {
            this.emitSuccess(data);
          })
          .catch((err) => {
            this.emitError(err);
          })
          .finally(() => {
            this.setLoading(false);
            this.cleanForm();
          });
      }
    }
  };
</script>
