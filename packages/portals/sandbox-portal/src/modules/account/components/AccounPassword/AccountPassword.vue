<template>
  <vex-section>
    <ve-stack :gap="32">
      <vex-section-title :title="$t('auth.changePassTitle')" />
      <v-sheet max-width="400">
        <auth-change-password
          @success="handleChangePassSuccess"
          @error="handleChangePassError"
        />
      </v-sheet>
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { AuthChangePassword } from '@deip/auth-module';

  export default {
    name: 'AccountPassword',
    components: {
      VexSection,
      VexSectionTitle,
      VeStack,
      AuthChangePassword
    },
    methods: {
      handleChangePassError(error) {
        this.$notifier.showError(error);
      },
      handleChangePassSuccess() {
        this.$notifier.showSuccess(this.$t('auth.changePassSuccess'));
      }
    }
  };
</script>
