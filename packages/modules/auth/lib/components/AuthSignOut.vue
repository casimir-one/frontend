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
    name: 'AuthSignOut',
    props: {
      buttonLabel: {
        type: String,
        default() { return this.$t('module.auth.signOut'); }
      }
    },
    methods: {
      signOut() {
        this.$store.dispatch('auth/signOut');
      }
    }
  };
</script>
