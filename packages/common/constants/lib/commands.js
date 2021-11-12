import { createEnum } from '@deip/toolbox';

const APP_CMD = createEnum({
  CREATE_ACCOUNT: 1,
  UPDATE_ACCOUNT: 2,
  CREATE_PROJECT: 3,
  UPDATE_PROJECT: 4,
  DELETE_PROJECT: 5,
  JOIN_TEAM: 6,
  CREATE_PROPOSAL: 7,
  UPDATE_PROPOSAL: 8,
  DECLINE_PROPOSAL: 9,
  CREATE_ATTRIBUTE: 10,
  UPDATE_ATTRIBUTE: 11,
  DELETE_ATTRIBUTE: 12,
  LEAVE_TEAM: 13,
  CREATE_INVESTMENT_OPPORTUNITY: 14,
  INVEST: 15,
  ASSET_TRANSFER: 16,
  CREATE_DOCUMENT_TEMPLATE: 17,
  UPDATE_DOCUMENT_TEMPLATE: 18,
  DELETE_DOCUMENT_TEMPLATE: 19,
  CREATE_ASSET: 20,
  ISSUE_ASSET: 21,
  CREATE_DRAFT: 22,
  UPDATE_DRAFT: 23,
  DELETE_DRAFT: 24,
  CREATE_PROJECT_CONTENT: 25,
  CREATE_REVIEW_REQUEST: 26,
  DECLINE_REVIEW_REQUEST: 27,
  CREATE_REVIEW: 28,
  UPVOTE_REVIEW: 29,
  CREATE_PROJECT_NDA: 30,
  CREATE_CONTRACT_AGREEMENT: 31,
  ACCEPT_CONTRACT_AGREEMENT: 32,
  REJECT_CONTRACT_AGREEMENT: 33,
  UPDATE_PORTAL_PROFILE: 34,
  UPDATE_PORTAL_SETTINGS: 35,
  UPDATE_LAYOUT: 36,
  UPDATE_LAYOUT_SETTINGS: 37,
  UPDATE_ATTRIBUTE_SETTINGS: 38,
  UPDATE_NETWORK_SETTINGS: 39,
  DELETE_USER_PROFILE: 40
});

const APP_PROPOSAL = createEnum({
  PROJECT_PROPOSAL: 1,
  PROJECT_UPDATE_PROPOSAL: 2,
  PROJECT_CONTENT_PROPOSAL: 3,
  PROJECT_FUNDRASE_PROPOSAL: 4,
  TEAM_UPDATE_PROPOSAL: 5,
  JOIN_TEAM_PROPOSAL: 6,
  LEAVE_TEAM_PROPOSAL: 7,
  ASSET_TRANSFER_PROPOSAL: 8,
  EXPRESS_LICENSE_PROPOSAL: 9,
  ASSET_EXCHANGE_PROPOSAL: 10,
  PROJECT_NDA_PROPOSAL: 11,
  PROJECT_TOKEN_SALE_PROPOSAL: 12,
  CONTRACT_AGREEMENT_PROPOSAL: 13
});

export {
  APP_CMD,
  APP_PROPOSAL
};
