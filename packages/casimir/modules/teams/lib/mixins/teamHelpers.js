export const teamHelpersMixin = {
  /**
 * @mixin
 */
  methods: {
    $$teamName(team) {
      if (!team) return null;

      const title = this.$attributes.getMappedData(
        'team.name',
        team.attributes
      );

      if (!title) return null;

      return title.value;
    },

    $$teamAvatarSrc(team, opts = {}) {
      if (!team) return null;

      const avatar = this.$attributes.getMappedData(
        'team.logo',
        team.attributes
      );

      if (!avatar) return null;

      return this.$attributes.getFileSrc({
        scope: 'team',
        scopeId: team._id,
        attributeId: avatar.attributeId,
        filename: avatar.value,
        ...opts
      });
    }
  }
};
