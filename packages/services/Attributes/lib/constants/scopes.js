import { createEnum } from '@deip/toolbox';

const ATTR_SCOPES = createEnum({
  PROJECT: 1,
  USER: 2,
  TEAM: 3
});

const ATTR_SCOPES_LABELS = {
  [ATTR_SCOPES.PROJECT]: 'Project',
  [ATTR_SCOPES.USER]: 'User',
  [ATTR_SCOPES.TEAM]: 'Team'
};

export {
  ATTR_SCOPES,
  ATTR_SCOPES_LABELS
};
