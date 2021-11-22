import { createEnum } from '@deip/toolbox';

const SYSTEM_ROLE = createEnum({
  ADMIN: 'admin',
  TEAM_ADMIN: 'team-admin',
  ANY: '*'
});

const SIGN_UP_POLICY = createEnum({
  FREE: 1,
  ADMIN_APPROVAL: 2
});

export {
  SYSTEM_ROLE,
  SIGN_UP_POLICY
};
