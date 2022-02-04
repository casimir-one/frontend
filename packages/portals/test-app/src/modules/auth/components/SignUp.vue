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
          {{ $t('auth.registration') }}
        </div>

        <auth-sign-up
          @success="handleSignUpSuccess"
          @error="handleSignUpError"
        />
      </ve-stack>
    </v-card>

    <div class="text-caption text--secondary text-center">
      {{ $t('auth.poweredByDEIP') }}
    </div>
  </v-sheet>
</template>

<script>
  import { AuthSignUp } from '@deip/auth-module';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'SignUp',
    components: {
      AuthSignUp,
      VeStack
    },

    data() {
      return {
        tab: 0,
        schoolName: ''
      };
    },

    methods: {
      handleSignUpSuccess() {
        this.$currentUser.await(() => {
          this.$notifier.showSuccess(this.$t('auth.signUpSuccess'));
          this.$router.push({ name: 'home' });
        });
      },
      handleSignUpError(error) {
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
