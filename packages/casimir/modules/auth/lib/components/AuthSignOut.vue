<template>
  <div>
    <slot v-bind="{ signOut }">
      <v-btn text @click="signOut">
        {{ buttonLabel }}
      </v-btn>
    </slot>
  </div>
</template>

<script>
  /**
   * Component for user logging out of the authorization system
   */
  export default {
    name: 'AuthSignOut',
    props: {
      /**
       * Label for button
       * @example "sign out"
       */
      buttonLabel: {
        type: String,
        default() { return this.$t('module.auth.signOut'); }
      }
    },
    methods: {
      /**
       * Allows the user to log out of the account
       * Gets called when the user clicks on the button
       */
      signOut() {
        this.$store.dispatch('auth/signOut');
      }
    }
  };
</script>
