<template>
  <v-form ref="changePasswordForm" v-model="isFormValid" @submit.prevent>
    <!-- original password -->
    <v-text-field
      v-model="oldPassword"
      outlined
      :label="oldPasswordLabel"
      :append-icon="!isHidden.oldPass ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isHidden.oldPass ? 'password' : 'text'"
      :rules="[rules.required]"
      :disabled="loading"
      @click:append="isHidden.oldPass = !isHidden.oldPass"
    />

    <!-- new password -->
    <v-text-field
      v-model="newPassword"
      outlined
      :label="newPasswordLabel"
      :append-icon="!isHidden.newPass ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isHidden.newPass ? 'password' : 'text'"
      :rules="[rules.required, rules.newPassword]"
      :disabled="loading"
      @click:append="isHidden.newPass = !isHidden.newPass"
    />

    <!-- repeat new password -->
    <v-text-field
      v-model="repeatPassword"
      outlined
      :label="$t('module.auth.resetPassword.repeatPasswordLabel')"
      :append-icon="!isHidden.repeatPass ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isHidden.repeatPass ? 'password' : 'text'"
      :rules="[rules.required, rules.repeatPassword]"
      :disabled="loading"
      @click:append="isHidden.repeatPass = !isHidden.repeatPass"
    />

    <div class="d-flex align-center">
      <v-spacer />
      <vex-stack horizontal gap="8">
        <v-btn
          text
          type="button"
          color="primary"
          :disabled="loading"
          @click="cleanForm"
        >
          {{ cancelBtn }}
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          class="ml-2"
          :loading="loading"
          :disabled="!isFormValid || loading"
          @click="updatePassword"
        >
          {{ submitBtn }}
        </v-btn>
      </vex-stack>
    </div>
  </v-form>
</template>

<script>
  import { VexStack } from '@deip/vuetify-extended';

  export default {
    name: 'AuthChangePassword',

    components: {
      VexStack
    },

    props: {
      oldPasswordLabel: {
        type: String,
        default() { return this.$t('module.auth.resetPassword.oldPasswordLabel'); }
      },
      newPasswordLabel: {
        type: String,
        default() { return this.$t('module.auth.resetPassword.newPasswordLabel'); }
      },
      repeatPasswordLabel: {
        type: String,
        default() { return this.$t('module.auth.resetPassword.repeatPasswordLabel'); }
      },
      submitBtn: {
        type: String,
        default() { return this.$t('module.auth.resetPassword.submitBtn'); }
      },
      cancelBtn: {
        type: String,
        default() { return this.$t('module.auth.resetPassword.cancelBtn'); }
      }
    },

    data() {
      return {
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',

        isHidden: {
          oldPass: true,
          newPass: true,
          repeatPass: true
        },

        loading: false,
        isFormValid: false,

        rules: {
          required: (value) => !!value || this.$t('module.auth.resetPassword.fieldRules.required'),
          newPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return this.$t(
                'module.auth.resetPassword.fieldRules.masterPasswordMinLength'
              );
            }

            if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return this.$t(
                'module.auth.resetPassword.fieldRules.masterPasswordMaxLength'
              );
            }

            return true;
          },
          repeatPassword: (value) => value === this.newPassword
            || this.$t('module.auth.resetPassword.fieldRules.repeatMasterPassword')
        }
      };
    },

    methods: {
      setLoading(state) {
        this.loading = state;
      },

      emitSuccess(data) {
        this.setLoading(false);
        this.$emit('success', data);
      },

      emitError(error) {
        this.setLoading(false);
        this.$emit('error', error);
      },

      cleanForm() {
        return this.$refs.changePasswordForm.reset();
      },

      updatePassword() {
        const passwordData = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        };

        this.setLoading(true);

        return this.$store.dispatch('auth/changePassword', {
          initiator: this.$currentUser,
          data: passwordData
        })
          .then((data) => {
            this.emitSuccess(data);
          })
          .catch((err) => {
            this.emitError(err);
          })
          .finally(() => {
            this.cleanForm();
          });
      }
    }
  };
</script>
