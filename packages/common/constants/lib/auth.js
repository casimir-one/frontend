import { createEnum } from '@deip/toolbox';

const SYSTEM_ROLE = createEnum({
  ADMIN: 'admin',
  TEAM_ADMIN: 'team-admin',
  ANY: '*'
});

export {
  SYSTEM_ROLE
};
