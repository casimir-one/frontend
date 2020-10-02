import { createEnum } from '@deip/toolbox';
import deipRpc from '@deip/rpc-client';

const PROPOSAL_TYPES = createEnum({
  CREATE_RESEARCH: deipRpc.operations.getOperationTag("create_research"),
  INVITE_MEMBER: deipRpc.operations.getOperationTag("join_research_group_membership"),
  EXCLUDE_MEMBER: deipRpc.operations.getOperationTag("leave_research_group_membership"),
  TRANSFER: deipRpc.operations.getOperationTag("transfer"),
  CREATE_RESEARCH_TOKEN_SALE: deipRpc.operations.getOperationTag("create_research_token_sale"),
  CREATE_RESEARCH_MATERIAL: deipRpc.operations.getOperationTag("create_research_content"),
  UPDATE_RESEARCH_GROUP: deipRpc.operations.getOperationTag("update_account"),
  UPDATE_RESEARCH: deipRpc.operations.getOperationTag("update_research")
});

export {
  PROPOSAL_TYPES
};
