<template>
  <vex-avatar
    :src="avatarSrc"
    :title="userName"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@casimir.one/vuetify-extended';
  import { getBindableProps } from '@casimir.one/vuetify-extended/lib/composables/props';
  import { defineComponent } from '@casimir.one/platform-util';

  import { userHelpersMixin } from '../../mixins';

  export default defineComponent({
    name: 'UserAvatar',

    components: { VexAvatar },

    mixins: [userHelpersMixin],

    props: {
      ...VexAvatar.options.props,

      /**
       * User info
       */
      user: {
        type: Object,
        default: null
      }
    },

    computed: {
      /**
       * Get computed avatar properties
       */
      avatarProps() {
        return getBindableProps.call(this, VexAvatar.options.props);
      },

      /**
       * Get computed username
       */
      userName() {
        return this.$$userFullName(this.user);
      },

      /**
       * Get computed avatar src
       * @returns {null | string}
       */
      avatarSrc() {
        /**
         * @summary If you need trim image on server add options param
         * @example
         * const opts = {
         *          width: this.$props.size,
         *          height: this.$props.size,
         *          image:true,
         *       };
         * this.$$userAvatarSrc(this.user, opts);
         */
        const url = this.$$userAvatarSrc(this.user);

        return !url ? null : `${url}?cache=${this.user.updatedAt}`;
      }

    }

  });
</script>
