<template>
  <div>
    <v-btn
      v-if="$isGuest"
      color="primary"
      depressed
      :to="{ name: 'signIn' }"
    >
      {{ $t('auth.signIn') }}
    </v-btn>

    <v-menu
      v-if="$isUser"
      bottom
      left
      offset-y
      min-width="220"
    >
      <template #activator="{ on }">
        <v-btn
          icon
          width="40"
          height="40"
          v-on="on"
        >
          <user-avatar :user="$currentUser" :size="40" v-on="on" />
        </v-btn>
      </template>

      <v-list dense active-class="primary">
        <v-list-item
          v-for="(item, index) of userMenu"
          :key="'nav-tab-' + index"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon v-if="item.icon">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ item.label }}
          </v-list-item-title>
        </v-list-item>

        <template v-if="$currentUser.isAdmin">
          <v-divider />
          <v-list-item
            :to="{ name: 'admin' }"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('components.appBar.admin') }}</v-list-item-title>
          </v-list-item>
        </template>

        <v-divider />

        <v-list-item @click="handleSignOut">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('auth.signOut') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import { UserAvatar } from '@deip/users-module';

  export default {
    name: 'XAppBarUser',
    components: { UserAvatar },
    computed: {
      userMenu() {
        return [
          {
            label: this.$t('components.appBar.account'),
            icon: 'mdi-account-outline',
            to: { name: 'account.details' }
          },
          {
            label: this.$t('components.appBar.wallet'),
            icon: 'mdi-wallet-outline',
            to: { name: 'account.wallet' }
          }
        ];
      }
    },
    methods: {
      handleSignOut() {
        this.$store.dispatch('auth/signOut');
      }
    }

  };
</script>
