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
  export default {
    name: "AuthSignOut",
    props: {
      buttonLabel: {
        type: String,
        default: 'Sign out'
      }
    },
    methods: {
      signOut() {
        this.$store.dispatch('auth/signOut');
      }
    }
  }
</script>
