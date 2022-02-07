<template>
  <vex-avatar
    :src="avatarSrc"
    :title="userName"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@deip/vuetify-extended';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { defineComponent } from '@deip/platform-util';

  import { userHelpersMixin } from '../../mixins';

  export default defineComponent({
    name: 'UserAvatar',

    components: { VexAvatar },

    mixins: [userHelpersMixin],

    props: {
      ...VexAvatar.options.props,

      user: {
        type: Object,
        default: null
      }
    },

    computed: {
      avatarProps() {
        return getBindableProps.call(this, VexAvatar.options.props);
      },

      userName() {
        return this.$$userFullName(this.user);
      },

      /** @returns {null | string} */
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
