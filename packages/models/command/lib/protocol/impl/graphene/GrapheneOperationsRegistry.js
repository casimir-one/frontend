import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { APP_CMD } from './../../../app/constants';


const GRAPHENE_OPERATIONS_MAP = (api) => {

  return {


    [APP_CMD.CREATE_ACCOUNT]: ({
      entityId,
      isTeamAccount,
      fee,
      creator,
      description,
      authority,
      memoKey,
    }, txContext) => {

      const ownerAuths = {
        account_auths: [],
        key_auths: [],
        weight_threshold: authority.owner ? authority.owner.weight : 1
      };

      const activeAuths = {
        account_auths: [],
        key_auths: [],
        weight_threshold: authority.active ? authority.active.weight : 1
      };

      for (let i = 0; i < authority.owner.auths.length; i++) {
        let auth = authority.owner.auths[i];
        if (auth.name) {
          ownerAuths.account_auths.push([auth.name, auth.weight]);
        } else {
          ownerAuths.key_auths.push([auth.key, auth.weight]);
        }
      }

      for (let i = 0; i < authority.active.auths.length; i++) {
        let auth = authority.active.auths[i];
        if (auth.name) {
          activeAuths.account_auths.push([auth.name, auth.weight]);
        } else {
          activeAuths.key_auths.push([auth.key, auth.weight]);
        }
      }
      
      const op = ['create_account', {
        fee: fee,
        creator: creator,
        new_account_name: entityId,
        owner: ownerAuths,
        active: activeAuths,
        active_overrides: [],
        memo_key: memoKey,
        json_metadata: JSON.stringify({ description }),
        traits: isTeamAccount
          ? [["research_group", { description: "", extensions: [] }]] // deprecated
          : [],
        extensions: []
      }];

      const [accountId, createAccountOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createAccountOp;
    },

    [APP_CMD.UPDATE_ACCOUNT]: ({
      description,
      entityId,
      isTeamAccount,
      memoKey,
      ownerAuth,
      activeAuth
    }, txContext) => {
      const updateAccountOp = ['update_account', {
        account: entityId,
        owner: ownerAuth || undefined,
        active: activeAuth || undefined,
        active_overrides: [],
        memo_key: memoKey || undefined,
        json_metadata: JSON.stringify({ description }),
        traits: isTeamAccount
          ? [["research_group", { description: "", extensions: [] }]] // deprecated
          : [],
        update_extensions: []
      }];

      return updateAccountOp;
    },


    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare
    }, txContext) => {

      const op = ['create_research', {
        external_id: entityId,
        account: teamId,
        description: description,
        disciplines: domains,
        is_private: isPrivate || false,
        members: members,
        review_share: reviewShare || undefined,
        compensation_share: compensationShare || undefined,
        extensions: []
      }];

      const [projectId, createResearchOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createResearchOp;
    },


    [APP_CMD.UPDATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      isPrivate,
      reviewShare,
      compensationShare,
      members
    }, txContext) => {

      const updateProjectOp = ['update_research', {
        external_id: entityId,
        account: teamId,
        description: description,
        is_private: isPrivate || false,
        review_share: reviewShare || undefined,
        compensation_share: compensationShare || undefined,
        members: members,
        update_extensions: []
      }];

      return updateProjectOp;
    },


    [APP_CMD.JOIN_PROJECT_TEAM]: ({
      member,
      teamId
    }, txContext) => {

      const joinProjectOp = ['update_account', {
        account: teamId,
        owner: undefined,
        active: undefined,
        active_overrides: undefined,
        memo_key: undefined,
        json_metadata: undefined,
        traits: undefined,
        update_extensions: [
          ["authority_update", {

            active_accounts_to_add: [[member, 1]],
            active_accounts_to_remove: [],
            owner_accounts_to_add: [],
            owner_accounts_to_remove: [],
            active_keys_to_add: [],
            active_keys_to_remove: [],
            owner_keys_to_add: [],
            owner_keys_to_remove: []

          }]
        ]
      }];

      return joinProjectOp;
    },


    [APP_CMD.LEAVE_PROJECT_TEAM]: ({
      member,
      teamId
    }, txContext) => {

      const leaveProjectOp = ['update_account', {
        account: teamId,
        owner: undefined,
        active: undefined,
        active_overrides: undefined,
        memo_key: undefined,
        json_metadata: undefined,
        traits: undefined,
        update_extensions: [
          ["authority_update", {

            active_accounts_to_add: [],
            active_accounts_to_remove: [member],
            owner_accounts_to_add: [],
            owner_accounts_to_remove: [member],
            active_keys_to_add: [],
            active_keys_to_remove: [],
            owner_keys_to_add: [],
            owner_keys_to_remove: []

          }]
        ]
      }];

      return leaveProjectOp;
    },


    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds
    }, txContext) => {

      const op = ['create_proposal', {
        external_id: entityId,
        creator: creator,
        proposed_ops: proposedCmds.map((cmd) => ({ op: cmd.getProtocolOp() })),
        expiration_time: expirationTime,
        review_period_seconds: reviewPeriodSeconds || undefined
      }];

      const [proposalId, createProposalOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createProposalOp;
    },


    [APP_CMD.UPDATE_PROPOSAL]: ({
      entityId,
      activeApprovalsToAdd,
      activeApprovalsToRemove,
      ownerApprovalsToAdd,
      ownerApprovalsToRemove,
      keyApprovalsToAdd,
      keyApprovalsToRemove
    }, txContext) => {

      const updateProposalOp = ['update_proposal', {
        external_id: entityId,
        active_approvals_to_add: activeApprovalsToAdd || [],
        active_approvals_to_remove: activeApprovalsToRemove || [],
        owner_approvals_to_add: ownerApprovalsToAdd || [],
        owner_approvals_to_remove: ownerApprovalsToRemove || [],
        key_approvals_to_add: keyApprovalsToAdd || [],
        key_approvals_to_remove: keyApprovalsToRemove || [],
        extensions: []
      }];

      return updateProposalOp;
    },

    
    [APP_CMD.DECLINE_PROPOSAL]: ({
      entityId,
      account,
      authorityType,
    }, txContext) => {

      const declineProposalOp = ['delete_proposal', {
        external_id: entityId,
        account: account,
        authority: authorityType,
        extensions: []
      }];

      return declineProposalOp;
    },

    [APP_CMD.CREATE_PROJECT_TOKEN_SALE]: ({
      entityId,
      teamId,
      projectId,
      startTime,
      endTime,
      securityTokensOnSale,
      softCap,
      hardCap
    }, txContext) => {

      const op = ['create_research_token_sale', {
        research_group: teamId,
        research_external_id: projectId,
        start_time: startTime,
        end_time: endTime,
        security_tokens_on_sale: securityTokensOnSale,
        soft_cap: softCap,
        hard_cap: hardCap,
        extensions: []
      }];

      const [tokenSaleId, createProjectTokenSaleOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createProjectTokenSaleOp;
    },

    [APP_CMD.CONTRIBUTE_PROJECT_TOKEN_SALE]: ({
      tokenSaleId,
      contributor,
      amount,
    }, txContext) => {

      const contributeToTokenSaleOp = ['contribute_to_token_sale', {
        token_sale_external_id: tokenSaleId,
        contributor,
        amount,
        extensions: []
      }];

      return contributeToTokenSaleOp;
    },

  }
}

class GrapheneOperationsRegistry extends BaseOperationsRegistry {
  constructor(api) {
    super(GRAPHENE_OPERATIONS_MAP(api));
  }
}


export default GrapheneOperationsRegistry;