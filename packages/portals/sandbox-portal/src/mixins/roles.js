import { SYSTEM_ROLE } from '@deip/constants';

export const rolesFactory = (teamIdPath) => ({
  computed: {
    $$isTeamAdmin() {
      const id = this[teamIdPath];
      if (!id) return false;

      const scope = { name: 'teamId', id };
      return this.$currentUser.hasRole(SYSTEM_ROLE.TEAM_ADMIN, scope);
    }
  }
});
