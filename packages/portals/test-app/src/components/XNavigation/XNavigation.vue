<template>
  <v-navigation-drawer
    v-if="!sideBarState.disabled"
    v-model="isOpen"
    v-bind="states"
  >
    <x-navigation-menu
      :items="stateMenu"
    />
  </v-navigation-drawer>
</template>

<script>
  import XNavigationMenu from '@/components/XNavigation/XNavigationMenu';
  import { adminRouter } from '@/modules/admin/router';
  import { getRouterNames } from '@/composables';
  import { accountRouter } from '@/modules/account/router';

  export default {
    name: 'XNavigation',
    components: { XNavigationMenu },
    data() {
      return {
        menu: {
          global: [
            { icon: 'mdi-account-group-outline', title: this.$t('components.navigation.teams'), to: { name: 'teams' } },
            { icon: 'mdi-lightbulb-on-outline', title: this.$t('components.navigation.projects'), to: { name: 'projects' } },
            { icon: 'mdi-briefcase-outline', title: this.$t('components.navigation.investments'), to: { name: 'investments' } }
          ],
          admin: [
            { icon: 'mdi-account-multiple', title: this.$t('components.navigation.members'), to: { name: 'admin.users' } },
            { icon: 'mdi-domain', title: this.$t('components.navigation.teams'), to: { name: 'admin.teams' } },
            { icon: 'mdi-school', title: this.$t('components.navigation.projects'), to: { name: 'admin.projects' } },
            { icon: 'mdi-puzzle-outline', title: 'Attributes', to: { name: 'admin.attributes' } },
            { icon: 'mdi-view-quilt-outline', title: 'Layouts', to: { name: 'admin.layouts' } }
          ],
          account: [
            { icon: 'mdi-account-outline', title: this.$t('components.appBar.account'), to: { name: 'account.details' } },
            { icon: 'mdi-wallet-outline', title: this.$t('components.appBar.wallet'), to: { name: 'account.wallet' } },
            { icon: 'mdi-lock-outline', title: this.$t('components.appBar.password'), to: { name: 'account.password' } }
          ]
        }
      };
    },

    computed: {
      stateMenu() {
        const isAdmin = getRouterNames(adminRouter).includes(this.$route.name);
        const isAccount = getRouterNames(accountRouter).includes(this.$route.name);

        const { type } = this.sideBarState;

        if (type !== 'default') {
          return this.menu[type] || this.menu.global;
        }

        if (isAdmin) {
          return this.menu.admin;
        }

        if (isAccount) {
          return this.menu.account;
        }

        return this.menu.global;
      },

      sideBarState() {
        return this.$store.getters['layout/sideBar'];
      },

      isOpen: {
        get() {
          return this.$store.getters['layout/sideBar'].isVisible;
        },
        set(value) {
          this.$store.dispatch('layout/changeSideBarState', {
            isVisible: value
          });
        }
      },

      states() {
        const {
          sm, md, smAndUp
        } = this.$vuetify.breakpoint;

        return {
          app: true,
          clipped: true,
          permanent: smAndUp && this.isOpen,
          expandOnHover: sm || md,
          miniVariant: sm || md
        };
      }
    }
  };
</script>
