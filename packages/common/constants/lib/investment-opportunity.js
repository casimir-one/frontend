import { createEnum } from '@deip/toolbox';

const INVESTMENT_OPPORTUNITY_STATUS = createEnum({
  ACTIVE: 1,
  FINISHED: 2,
  EXPIRED: 3,
  INACTIVE: 4
});

const MIN_TOKEN_UNITS_TO_SELL = 100;

export {
  MIN_TOKEN_UNITS_TO_SELL,
  INVESTMENT_OPPORTUNITY_STATUS
};
