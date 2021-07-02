import { createEnum } from '@deip/toolbox';

const ENTITIES_SCOPES = createEnum({
  PROJECT: 1,
  USER: 2,
  TEAM: 3
});

const ENTITIES_SCOPES_LABELS = {
  [ENTITIES_SCOPES.PROJECT]: 'Project',
  [ENTITIES_SCOPES.USER]: 'User',
  [ENTITIES_SCOPES.TEAM]: 'Team'
};

export {
  ENTITIES_SCOPES,
  ENTITIES_SCOPES_LABELS
};
