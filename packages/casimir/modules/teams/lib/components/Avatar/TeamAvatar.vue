<template>
  <vex-avatar
    :src="$$teamAvatarSrc(team, avatarOptions)"
    fallback-icon="mdi-account-group-outline"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@deip/vuetify-extended';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { teamHelpersMixin } from '../../mixins';

  export default {
    name: 'TeamAvatar',

    components: { VexAvatar },

    mixins: [teamHelpersMixin],

    props: {
      ...VexAvatar.options.props,

      team: {
        type: Object,
        default() { return {}; }
      }
    },

    computed: {
      avatarProps() {
        return getBindableProps.call(this, VexAvatar.options.props);
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
