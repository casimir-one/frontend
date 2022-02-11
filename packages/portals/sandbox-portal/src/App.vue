<template>
  <v-app>
    <x-app-bar />
    <x-navigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import XAppBar from '@/components/XAppBar/XAppBar';
  import XNavigation from '@/components/XNavigation/XNavigation';

  export default {
    name: 'App',
    components: {
      XNavigation,
      XAppBar
    }
  };
</script>

<style lang="scss">
  .v-main {
    transition: none;
  }
</style>
