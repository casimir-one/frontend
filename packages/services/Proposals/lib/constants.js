import { createEnum } from '@deip/toolbox';
import deipRpc from '@deip/rpc-client';

const PROPOSAL_TYPES = createEnum({
  CREATE_RESEARCH: deipRpc.formatter.getOperationTag("create_research"),
  INVITE_MEMBER: deipRpc.formatter.getOperationTag("join_research_group_membership"),
  EXCLUDE_MEMBER: deipRpc.formatter.getOperationTag("left_research_group_membership"),
  TRANSFER: deipRpc.formatter.getOperationTag("transfer"),
  CREATE_RESEARCH_TOKEN_SALE: deipRpc.formatter.getOperationTag("create_research_token_sale"),
  CREATE_RESEARCH_MATERIAL: deipRpc.formatter.getOperationTag("create_research_content"),
  UPDATE_RESEARCH_GROUP: deipRpc.formatter.getOperationTag("update_account"),
  UPDATE_RESEARCH: deipRpc.formatter.getOperationTag("update_research")
});

export {
  PROPOSAL_TYPES
};
