import { createEnum } from '@deip/toolbox';

const ENTITY_SCOPE = createEnum({
  PROJECT: 1,
  USER: 2,
  TEAM: 3
});

const ENTITY_SCOPE_LABEL = {
  [ENTITY_SCOPE.PROJECT]: 'Project',
  [ENTITY_SCOPE.USER]: 'User',
  [ENTITY_SCOPE.TEAM]: 'Team'
};

export {
  ENTITY_SCOPE,
  ENTITY_SCOPE_LABEL
};
