import { createEnum } from '@deip/toolbox';

// TODO: Use APP_PROPOSAL const
const PROPOSAL_TYPES = createEnum({
  CREATE_RESEARCH: 14,
  INVITE_MEMBER: 12,
  EXCLUDE_MEMBER: 13,
  TRANSFER: 2,
  CREATE_RESEARCH_TOKEN_SALE: 19,
  CREATE_RESEARCH_MATERIAL: 16,
  UPDATE_RESEARCH_GROUP: 1,
  UPDATE_RESEARCH: 15
});

const PROPOSAL_STATUS = createEnum({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  FAILED: 4,
  EXPIRED: 5
});

export {
  PROPOSAL_TYPES,
  PROPOSAL_STATUS
};
