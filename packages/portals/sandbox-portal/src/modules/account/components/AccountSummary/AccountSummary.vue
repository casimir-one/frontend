<template>
  <vex-section v-if="$currentUser.exists()">
    <ve-stack :gap="32">
      <vex-section-title :title="$t('account.profile.title')" />
      <user-form
        :schema="$layouts.getMappedData('user.form').value"
        :user="$currentUser"
        @success="handleSuccess"
        @error="handleError"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { UserForm } from '@deip/users-module';
  import { VIEW_MODE } from '@deip/constants';

  export default {
    name: 'AccountSummary',
    components: {
      VexSection,
      VexSectionTitle,
      VeStack,

      UserForm
    },

    data() {
      return {
        VIEW_MODE
      };
    },

    methods: {
      handleSuccess() {
        this.$notifier.showSuccess(this.$t('account.editSuccess'));
      },

      handleError(error) {
        this.$notifier.showError(error);
      }
    }
  };
</script>
