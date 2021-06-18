<template>
  <vex-avatar
    :src="avatarSrc"
    :text="initials"
    v-bind="avatarProps"
  />
</template>

<script>
  import { VexAvatar } from '@deip/vuetify-extended';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';

  export default {
    name: 'TeamAvatar',

    components: { VexAvatar },

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

      initials() {
        const title = this.$attributes.getMappedData(
          'teamTitle',
          this.team.researchGroupRef.attributes
        );

        if (!title) return null;

        return title.value[0].toUpperCase();
      },

      avatarSrc() {
        if (!this.team) return null;

        const avatar = this.$attributes.getMappedData(
          'teamLogo',
          this.team.researchGroupRef.attributes
        );

        if (!avatar) return null;

        const opts = {
          width: this.$props.size,
          height: this.$props.size
        };

        return this.$attributes.getFileSrc({
          scope: 'team',
          scopeId: this.team.externalId,
          attributeId: avatar.attributeId,
          filename: avatar.value,
          ...opts
        });
      }
    }
  };
</script>
