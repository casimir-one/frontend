<template>
  <v-sheet
    color="grey lighten-5"
    min-height="100vh"
    class="d-flex flex-column align-center justify-center pa-16"
  >
    <v-card
      class="mx-auto pa-12 mb-6"
      elevation="4"
      max-width="480"
      width="100%"
    >
      <ve-stack :gap="16" class="justify-items-center">
        <div class="text-h5 text-center">
          {{ $t('auth.signInToContinue') }}
        </div>

        <auth-sign-in
          :username-label="$t('auth.usernameOrEmail')"
          @success="handleSignInSuccess"
          @error="handleSignInError"
        />
      </ve-stack>
    </v-card>

    <div class="text-caption text--secondary text-center">
      {{ $t('auth.poweredByDEIP') }}
    </div>
  </v-sheet>
</template>

<script>
  import { AuthSignIn } from '@deip/auth-module';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'SignIn',
    components: {
      AuthSignIn,
      VeStack
    },

    methods: {
      handleSignInSuccess() {
        this.$notifier.showSuccess(this.$t('auth.signInSuccess'));
        this.$router.push({ name: 'home' });
      },
      handleSignInError(error) {
        this.$notifier.showError(error);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .w-100 {
    width: 100%;
  }
</style>
