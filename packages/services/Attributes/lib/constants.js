import { createEnum } from '@deip/toolbox';

const ATTRIBUTE_SCOPE = createEnum({
  PROJECT: 1,
  USER: 2,
  TEAM: 3
});

export {
  ATTRIBUTE_SCOPE
};
