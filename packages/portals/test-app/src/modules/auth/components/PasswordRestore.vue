<template>
  <v-sheet
    color="grey lighten-5"
    min-height="100vh"
    class="d-flex flex-column align-center justify-center pa-16"
  >
    <v-card
      class="mx-auto ml-auto pa-12 mb-6"
      elevation="4"
      max-width="480"
      width="100%"
    >
      <ve-stack :gap="16" class="justify-items-center">
        <div class="text-h4 text-center">
          {{ $t('auth.restorePassword') }}
        </div>

        <auth-password-restore />
      </ve-stack>
    </v-card>

    <div class="text-caption text--secondary text-center mt-4">
      {{ $t('auth.poweredByDEIP') }}
    </div>
  </v-sheet>
</template>

<script>
  import { AuthPasswordRestore } from '@deip/auth-module';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'PasswordRestore',
    components: {
      AuthPasswordRestore,
      VeStack
    }
  };
</script>
