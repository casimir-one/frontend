<template>
  <vex-section>
    <vex-stack gutter="32">
      <vex-section-title :title="title" />
      <v-sheet max-width="400">
        <v-form
          ref="changePasswordForm"
          v-model="isFormValid"
          @submit.prevent
        >
          <!-- original password -->
          <v-text-field
            v-model="oldPassword"
            outlined
            :label="$t('module.resetpass.oldPasswordLabel')"
            :append-icon="!isHidden.old ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isHidden.old ? 'password' : 'text'"
            :rules="[rules.required]"
            :disabled="loading"
            @click:append="isHidden.old = !isHidden.old"
          />

          <!-- new password -->
          <v-text-field
            v-model="newPassword"
            outlined
            :label="$t('module.resetpass.newPasswordLabel')"
            :append-icon="!isHidden.new ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isHidden.new ? 'password' : 'text'"
            :rules="[rules.required, rules.newPassword]"
            :disabled="loading"
            @click:append="isHidden.new = !isHidden.new"
          />

          <!-- repeat new password -->
          <v-text-field
            v-model="repeatPassword"
            outlined
            :label="$t('module.resetpass.repeatPasswordLabel')"
            :append-icon="!isHidden.rep ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isHidden.rep ? 'password' : 'text'"
            :rules="[rules.required, rules.repeatPassword]"
            :disabled="loading"
            @click:append="isHidden.rep = !isHidden.rep"
          />

          <div class="d-flex align-center">
            <v-spacer />
            <vex-stack horizontal gap="8">
              <v-btn
                text
                type="button"
                color="primary"
                :disabled="!isFormValid || loading"
                @click="cleanForm"
              >
                {{ $t('module.resetpass.cancelBtn') }}
              </v-btn>

              <v-btn
                type="submit"
                color="primary"
                class="ml-2"
                :loading="loading"
                :disabled="!isFormValid || loading"
                @click="updatePassword"
              >
                {{ $t('module.resetpass.submitBtn') }}
              </v-btn>
            </vex-stack>
          </div>
        </v-form>
      </v-sheet>
    </vex-stack>
  </vex-section>
</template>

<script>
  import { VexSection, VexSectionTitle, VexStack } from '@deip/vuetify-extended';

  export default {
    name: 'AuthChangePassword',

    components: {
      VexStack,
      VexSection,
      VexSectionTitle
    },

    props: {
      title: {
        type: String,
        default() {
          return this.$t('module.resetpass.title');
        }
      }

    },

    data() {
      return {

        oldPassword: '',
        newPassword: '',
        repeatPassword: '',

        isHidden: {
          new: true,
          old: true,
          rep: true
        },

        loading: false,
        isFormValid: false,

        rules: {
          required: (value) => !!value || this.$t('module.resetpass.fieldRules.required'),
          newPassword: (value) => {
            if (!value) return false;

            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) return this.$t('module.resetpass.fieldRules.masterPasswordMinLength');

            if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) return this.$t('module.resetpass.fieldRules.masterPasswordMaxLength');

            return true;
          },
          repeatPassword: (value) => value === this.newPassword || this.$t('module.resetpass.fieldRules.repeatMasterPassword')
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

        return this.$store.dispatch('auth/changePassword', { ...passwordData, ...this.$currentUser })
          .then((data) => {
            this.emitSuccess(data);

          // let logoutTimer = setTimeout(()=>{
          //     clearTimeout(logoutTimer)
          //     this.$store.dispatch('auth/signOut');
          // },3000)
          }).catch((err) => {
            this.emitError(err);
          }).finally(() => {
            this.cleanForm();
            this.setLoading(false);
          });
      }

    }

  };
</script>
