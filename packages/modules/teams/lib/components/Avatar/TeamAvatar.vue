<template>
  <vex-avatar
    :src="$$teamAvatarSrc(team, avatarOptions)"
    :text="$$teamInitials(team)"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@deip/vuetify-extended';
  import { teamHelpersMixin } from '@deip/platform-fns';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';

  export default {
    name: 'TeamAvatar',

    components: { VexAvatar },

    mixins: [teamHelpersMixin],

    props: {
      ...VexAvatar.props,

      team: {
        type: Object,
        default() { return {}; }
      }
    },

    computed: {
      avatarProps() {
        return getBindableProps.call(this, VexAvatar.props);
      },
      avatarOptions() {
        return {
          width: this.$props.size,
          height: this.$props.size
        };
      }
    }
  };
</script>
