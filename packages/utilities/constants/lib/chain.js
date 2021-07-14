import { createEnum } from '@deip/toolbox';

const PROTOCOL_CHAIN = createEnum({
  GRAPHENE: 1,
  SUBSTRATE: 2
});

// TODO:  Keep it sync with APP_CMD enum and replace it with APP_CMD enum completely
//        once we have a separate package for constants
const PROTOCOL_OPERATIONS_MAP = {
  CREATE_ACCOUNT: 1,
  UPDATE_ACCOUNT: 2,
  CREATE_PROJECT: 3,
  UPDATE_PROJECT: 4,
  // DELETE_PROJECT: 5,
  JOIN_PROJECT_TEAM: 6,
  CREATE_PROPOSAL: 7,
  UPDATE_PROPOSAL: 8,
  DECLINE_PROPOSAL: 9,
  // CREATE_ATTRIBUTE: 10,
  // UPDATE_ATTRIBUTE: 11,
  // DELETE_ATTRIBUTE: 12,
  LEAVE_PROJECT_TEAM: 13,
  CREATE_PROJECT_TOKEN_SALE: 14,
  CONTRIBUTE_PROJECT_TOKEN_SALE: 15,
  ASSET_TRANSFER: 16
};

export {
  PROTOCOL_CHAIN,
  PROTOCOL_OPERATIONS_MAP
};
