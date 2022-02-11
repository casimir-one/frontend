<template>
  <v-app-bar
    v-if="!appBarState.disabled"
    v-bind="appBarProps"
  >
    <template v-if="!isBackAppBar">
      <v-app-bar-nav-icon @click="toggleNavigation" />
      <v-app-bar-title class="text-h5">
        <router-link
          :to="{ name: 'home' }"
          class="font-weight-black text-decoration-none white--text d-block"
        >
          W3P
        </router-link>
      </v-app-bar-title>
    </template>

    <template v-if="isBackAppBar">
      <v-btn
        icon
        style="pointer-events: all"
        @click="$router.back()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </template>

    <v-spacer />

    <x-app-bar-user v-if="!isBackOnlyAppBar" style="pointer-events: all" />
  </v-app-bar>
</template>

<script>
  import XAppBarUser from '@/components/XAppBar/XAppBarUser';

  export default {
    name: 'XAppBar',
    components: { XAppBarUser },

    computed: {
      appBarState() {
        return this.$store.getters['layout/appBar'];
      },

      isBackAppBar() {
        return ['back', 'backOnly'].includes(this.appBarState.type);
      },

      isBackOnlyAppBar() {
        return this.appBarState.type === 'backOnly';
      },

      appBarProps() {
        if (this.isBackAppBar) {
          return {
            fixed: true,
            elevation: 0,
            color: 'transparent',
            style: 'pointer-events: none'
          };
        }

        return {
          dark: true,
          app: true,
          clippedLeft: true
        };
      }
    },
    methods: {
      toggleNavigation() {
        const { isVisible } = this.$store.getters['layout/sideBar'];
        this.$store.dispatch('layout/changeSideBarState', {
          isVisible: !isVisible
        });
      }
    }
  };
</script>
