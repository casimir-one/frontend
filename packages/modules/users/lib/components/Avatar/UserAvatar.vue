<template>
  <component
    :is="component"
    color="neutral lighten-5"
    v-bind="avatarProps"
  >
    <img v-if="src" :src="src" alt="avatar">
    <span
      v-else
      :class="[textClass, 'text--disabled']"
    >{{ userInitials(user) }}</span>
  </component>
</template>

<script>
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { VAvatar, VListItemAvatar } from 'vuetify/lib/components';

  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { userHelpersMixin } from '@deip/platform-fns';
  import { isString } from '@deip/toolbox';

  export default {
    name: 'UserAvatar',
    mixins: [userHelpersMixin],
    props: {
      ...VAvatar.options.props,
      ...VListItemAvatar.options.props,

      user: {
        type: Object,
        default() { return {}; }
      },

      viewType: {
        type: String,
        default: 'default'
      }
    },

    computed: {
      component() {
        if (this.viewType === 'listItem') {
          return VListItemAvatar;
        }

        return VAvatar;
      },

      avatarProps() {
        return getBindableProps.call(this, this.component.options.props);
      },

      src() {
        const opts = {
          width: this.$props.size,
          height: this.$props.size
        };
        return this.userAvatarSrc(this.user, opts);
      },

      sizeNumber() {
        if (isString(this.$props.size)) {
          return parseInt(this.$props.size.replace(/\D/g, ''), 10);
        }
        return this.$props.size;
      },

      textClass() {
        if (this.sizeNumber <= 40) {
          return 'text-caption';
        }
        if (this.sizeNumber <= 48) {
          return 'text-body-2';
        }
        return 'text-body-1';
      }
    }
  };
</script>
