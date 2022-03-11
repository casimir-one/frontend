<template>
  <div class="d-flex">
    <template v-if="clickable">
      <v-btn
        v-for="(user, index) in displayedUsers"
        :key="index"
        :class="$style.item"
        width="40"
        height="40"
        icon
        @click="onClickItem(user)"
      >
        <user-avatar
          size="40"
          :user="user"
        />
      </v-btn>
    </template>

    <template v-else>
      <div
        v-for="user in displayedUsers"
        :key="user._id"
        :class="$style.item"
      >
        <user-avatar
          size="40"
          :user="user"
        />
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
  import { defineComponent } from '@deip/platform-util';

  import { userHelpersMixin } from '../../mixins';
  import { UserAvatar } from '../UserAvatar';

  export default defineComponent({
    name: 'UsersListStack',

    components: { UserAvatar },

    mixins: [userHelpersMixin],

    props: {
      /**
       * User list
       */
      users: {
        type: Array,
        default: () => ([])
      },
      /**
       * Length of stack
       */
      stackLength: {
        type: Number,
        default: 5
      }
    },

    computed: {
      /**
       * Get users depending on the stack length
       */
      displayedUsers() {
        return this.users.slice(0, this.stackLength);
      },
      /**
       * Get remaining users count depending on the stack length
       */
      remainingUsersCount() {
        return this.users.length - this.stackLength;
      },
      /**
       * Check if item is clickable
       */
      clickable() {
        return !!this.$listeners['click-item'];
      }
    },

    methods: {
      onClickItem(e) {
        /**
         * Click handler
         *
         * @property {Event} e
         */
        this.$emit('click-item', e);
      }
    }
  });
</script>

<style lang="scss" module>
  .item {
    box-shadow: 0 0 0 2px #FFF;
    margin-right: -8px;
    z-index: 1;
    border-radius: 50%;
  }
</style>
