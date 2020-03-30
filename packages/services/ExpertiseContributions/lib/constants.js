import { createEnum } from '@deip/toolbox';

const EXPERTISE_CONTRIBUTION_TYPE = createEnum({
  PUBLICATION: 1,
  REVIEW: 2,
  REVIEW_SUPPORT: 3
});

export {
  EXPERTISE_CONTRIBUTION_TYPE
};
