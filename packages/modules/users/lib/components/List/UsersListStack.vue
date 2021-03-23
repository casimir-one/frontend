<template>
  <div class="d-flex">

    <template v-if="clickable">
      <v-btn
        v-for="(user, index) of displayedUsers"
        :class="$style.item"
        width="40"
        height="40"
        icon
        @click="onClickItem(user)"
      >
        <v-avatar
          :key="index"
          size="40"
          color="neutral lighten-5"
        >
          <v-img :src="userAvatarSrc(user)" />
        </v-avatar>
      </v-btn>
    </template>

    <template v-else>
      <div
        v-for="(user, index) of displayedUsers"
        :class="$style.item"
      >
        <v-avatar
          :key="index"
          size="40"
          color="neutral lighten-5"
        >
          <v-img :src="userAvatarSrc(user)" />
        </v-avatar>
      </div>
    </template>

    <v-avatar
      v-if="remainingUsersCount > 0"
      size="40"
      color="neutral lighten-5"
      :class="$style.item"
    >
      <span class="text-caption font-weight-medium text--disabled">+{{ remainingUsersCount }}</span>
    </v-avatar>
  </div>
</template>

<script>
  import { userAvatarSrc } from '@deip/platform-fns';

  export default {
    name: 'UsersListStack',
    props: {
      users: {
        type: Array,
        default: () => ([])
      },

      stackLength: {
        type: Number,
        default: 5
      }
    },
    computed: {
      displayedUsers() {
        return this.users.slice(0, this.stackLength);
      },

      remainingUsersCount() {
        return this.users.length - this.stackLength;
      },

      clickable() {
        return !!this.$listeners['click-item'];
      },
    },
    methods: {
      userAvatarSrc,

      onClickItem(e) {
        this.$emit('click-item', e)
      }
    }
  };
</script>

<style lang="scss" module>
  .item {
    box-shadow: 0 0 0 2px #FFF;
    margin-right: -8px;
    z-index: 1;
    border-radius: 50%;
  }
</style>
