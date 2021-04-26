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
        owner: ownerAuths,
        active: activeAuths,
        active_overrides: [],
        memo_key: memoKey,
        json_metadata: JSON.stringify({ description }),
        traits: isTeamAccount
          ? [["research_group", { description: description, extensions: [] }]]
          : [],
        extensions: []
      }];

      const [accountId, createAccountOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createAccountOp;
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
        research_group: teamId,
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


    [APP_CMD.JOIN_PROJECT]: ({
      member,
      teamId,
      rewardShare,
      projectId
    }, txContext) => {

      const joinProjectOp = ['join_research_group_membership', {
        member: member,
        research_group: teamId,
        reward_share: rewardShare || '0.00 %',
        researches: [projectId],
        extensions: []
      }];

      return joinProjectOp;
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
        expiration_time: expirationTime || new Date(new Date().getTime() + 86400000 * 364 * 3).toISOString().split('.')[0],
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
    }

  }
}

class GrapheneOperationsRegistry extends BaseOperationsRegistry {
  constructor(api) {
    super(GRAPHENE_OPERATIONS_MAP(api));
  }
}


export default GrapheneOperationsRegistry;