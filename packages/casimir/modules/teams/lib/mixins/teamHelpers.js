export const teamHelpersMixin = {
  methods: {
    $$teamTitle(team) {
      if (!team) return null;

      const title = this.$attributes.getMappedData(
        'teamTitle',
        team.attributes
      );

      if (!title) return null;

      return title.value;
    },

    $$teamAvatarSrc(team, opts = {}) {
      if (!team) return null;

      const avatar = this.$attributes.getMappedData(
        'teamLogo',
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
