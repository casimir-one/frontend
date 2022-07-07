import { createEnum } from '@deip/toolbox';

export const INVESTMENT_OPPORTUNITY_STATUS = createEnum({
  ACTIVE: 1,
  FINISHED: 2,
  EXPIRED: 3,
  INACTIVE: 4
});
