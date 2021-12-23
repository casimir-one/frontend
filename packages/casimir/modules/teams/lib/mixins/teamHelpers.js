import { ATTR_SCOPES } from '@deip/constants';

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

    $$teamInitials(team) {
      const title = this.$$teamTitle(team);

      if (!title) return '×';

      return title[0].toUpperCase();
    },

    $$teamAvatarSrc(team, opts = {}) {
      if (!team) return null;

      const avatar = this.$attributes.getMappedData(
        'teamLogo',
        team.attributes
      );

      if (!avatar) return null;

      return this.$attributes.getFileSrc({
        scope: ATTR_SCOPES.TEAM,
        scopeId: team._id,
        attributeId: avatar.attributeId,
        filename: avatar.value,
        ...opts
      });
    }
  }
};
