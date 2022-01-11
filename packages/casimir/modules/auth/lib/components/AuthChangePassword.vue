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
  import { VexPasswordInput, VexPasswordRepeatInput } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'AuthChangePassword',
    components: {
      VeStack,
      VexPasswordInput,
      VexPasswordRepeatInput
    },
    props: {
      oldPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.oldPasswordLabel');
        }
      },
      newPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.newPasswordLabel');
        }
      },
      repeatPasswordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.repeatPasswordLabel');
        }
      },
      submitLabel: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.submitBtn');
        }
      },
      cancelBtn: {
        type: String,
        default() {
          return this.$t('module.auth.resetPassword.cancelBtn');
        }
      },
      fieldsProps: {
        type: Object,
        default: () => ({
          counter: true
        })
      },
      newPasswordMinLentgh: {
        type: Number,
        default: 10
      },
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
      setLoading(state) {
        this.loading = state;
        this.disabled = state;
      },
      emitSuccess(data) {
        this.$emit('success', data);
      },
      emitError(error) {
        this.$emit('error', error);
      },
      cleanForm() {
        this.$emit('cancel');
        this.$refs.changePasswordForm.reset();
        this.$refs.observer.reset();
      },
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
