import { createEnum } from '@casimir/toolbox';

export const CONTRACT_AGREEMENT_TYPE = createEnum({
  PROJECT_LICENSE: 1,
  INCOME_SHARE_AGREEMENT: 2,
  PROJECT_ACCESS: 3
});

export const CONTRACT_AGREEMENT_STATUS = createEnum({
  PROPOSED: 1,
  PENDING: 2,
  APPROVED: 3,
  REJECTED: 4
});
