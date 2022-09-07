<template>
  <vex-avatar
    :src="$$teamAvatarSrc(team, avatarOptions)"
    fallback-icon="mdi-account-group-outline"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@casimir.one/vuetify-extended';
  import { getBindableProps } from '@casimir.one/vuetify-extended/lib/composables/props';
  import { defineComponent } from '@casimir.one/platform-util';

  import { teamHelpersMixin } from '../../mixins';

  export default defineComponent({
    name: 'TeamAvatar',

    components: { VexAvatar },

    mixins: [teamHelpersMixin],

    props: {
      ...VexAvatar.options.props,

      /**
       * Team info
       */
      team: {
        type: Object,
        default() { return {}; }
      }
    },

    computed: {
      /**
       * Get computed avatar props
      */
      avatarProps() {
        return getBindableProps.call(this, VexAvatar.options.props);
      },
      /**
       * Get computed avatar options
      */
      avatarOptions() {
        return {
          width: this.$props.size,
          height: this.$props.size
        };
      }
    }
  });
</script>
