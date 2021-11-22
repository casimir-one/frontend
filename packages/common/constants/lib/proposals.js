import { createEnum } from '@deip/toolbox';

const PROPOSAL_STATUS = createEnum({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  FAILED: 4,
  EXPIRED: 5
});

export {
  PROPOSAL_STATUS
};
