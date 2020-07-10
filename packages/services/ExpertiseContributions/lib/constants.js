import { createEnum } from '@deip/toolbox';

const EXPERTISE_CONTRIBUTION_TYPE = createEnum({
  UNKNOWN: 0,
  PUBLICATION: 1,
  REVIEW: 2,
  REVIEW_SUPPORT: 3
});

const ECI_STAT_PERIOD_STEP_TYPE = createEnum({
  UNKNOWN: 0,
  DAY: 1,
  MONTH: 2
});

export {
  EXPERTISE_CONTRIBUTION_TYPE,
  ECI_STAT_PERIOD_STEP_TYPE
};
