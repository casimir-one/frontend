import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { APP_CMD } from '@deip/constants';


const GRAPHENE_OP_CMD_MAP = (chainNodeClient) => {

  return {

    [APP_CMD.CREATE_ACCOUNT]: ({
      entityId,
      isTeamAccount,
      fee,
      creator,
      description,
      authority,
      memoKey,
    }) => {

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

      const createAccountOp = ['create_account', {
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

      return [createAccountOp];
    },


    [APP_CMD.UPDATE_ACCOUNT]: ({
      entityId,
      description,
      isTeamAccount,
      memoKey,
      ownerAuth,
      activeAuth
    }) => {

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

      return [updateAccountOp];
    },


    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate
    }) => {

      const createResearchOp = ['create_research', {
        external_id: entityId,
        account: teamId,
        description: description,
        disciplines: domains,
        is_private: isPrivate || false,
        members: undefined, // deprecated
        review_share: undefined, // deprecated
        compensation_share: undefined, // deprecated
        extensions: []
      }];

      return [createResearchOp];
    },


    [APP_CMD.UPDATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      isPrivate
    }) => {

      const updateProjectOp = ['update_research', {
        external_id: entityId,
        account: teamId,
        description: description,
        is_private: isPrivate || false,
        review_share: undefined, // deprecated
        compensation_share: undefined, // deprecated
        members: undefined, // deprecated
        update_extensions: []
      }];

      return [updateProjectOp];
    },


    [APP_CMD.JOIN_PROJECT_TEAM]: ({
      member,
      teamId
    }) => {

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

      return [joinProjectOp];
    },


    [APP_CMD.LEAVE_PROJECT_TEAM]: ({
      member,
      teamId
    }) => {

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

      return [leaveProjectOp];
    },


    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds
    }, { cmdToOps }) => {

      const createProposalOp = ['create_proposal', {
        external_id: entityId,
        creator: creator,
        proposed_ops: proposedCmds.reduce((arr, cmd) => { 
          const ops = cmdToOps(cmd);
          for (let i = 0; i < ops.length; i++) {
            const op = ops[i];
            arr.push({ op });
          }
          return arr;
        }, []),
        expiration_time: expirationTime,
        review_period_seconds: reviewPeriodSeconds || undefined
      }];

      return [createProposalOp];
    },


    [APP_CMD.UPDATE_PROPOSAL]: ({
      entityId,
      activeApprovalsToAdd,
      activeApprovalsToRemove,
      ownerApprovalsToAdd,
      ownerApprovalsToRemove,
      keyApprovalsToAdd,
      keyApprovalsToRemove
    }) => {

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

      return [updateProposalOp];
    },


    [APP_CMD.DECLINE_PROPOSAL]: ({
      entityId,
      account,
      authorityType,
    }) => {

      const declineProposalOp = ['delete_proposal', {
        external_id: entityId,
        account: account,
        authority: authorityType,
        extensions: []
      }];

      return [declineProposalOp];
    },


    [APP_CMD.CREATE_INVESTMENT_OPPORTUNITY]: ({
      entityId,
      teamId,
      projectId,
      startTime,
      endTime,
      shares,
      softCap,
      hardCap
    }) => {

      const createInvestmentOppOp = ['create_research_token_sale', {
        external_id: entityId,
        research_group: teamId,
        research_external_id: projectId,
        start_time: startTime,
        end_time: endTime,
        security_tokens_on_sale: shares,
        soft_cap: softCap,
        hard_cap: hardCap,
        extensions: []
      }];

      return [createInvestmentOppOp];
    },


    [APP_CMD.INVEST]: ({
      tokenSaleId,
      investor,
      amount
    }) => {

      const investOp = ['contribute_to_token_sale', {
        token_sale_external_id: tokenSaleId,
        contributor: investor,
        amount: amount,
        extensions: []
      }];

      return [investOp];
    },


    [APP_CMD.ASSET_TRANSFER]: ({
      from,
      to,
      amount,
      memo
    }) => {
    
      const transferOp = ['transfer', {
        from: from,
        to: to,
        amount: amount,
        memo: memo || "",
        extensions: []
      }];
    
      return [transferOp];
    },


    [APP_CMD.CREATE_ASSET]: ({
      issuer,
      symbol,
      precision,
      description,
      maxSupply,
      projectTokenOption
    }) => {

      const traits = [];
      if (projectTokenOption) {
        const { projectId, teamId, licenseRevenue } = projectTokenOption;
        traits.push(
          ['research_security_token', {
            research_external_id: projectId,
            research_group: teamId,
            extensions: []
          }]
        );

        if (licenseRevenue) {
          const { holdersShare } = licenseRevenue;
          traits.push(
            ['research_license_revenue', {
              holders_share: holdersShare,
              extensions: []
            }]
          );
        }
      }

      const createAssetOp = ['create_asset', {
        issuer: issuer,
        symbol: symbol,
        precision: precision,
        description: description,
        max_supply: maxSupply,
        traits: traits,
        extensions: []
      }];

      return [createAssetOp];
    },


    [APP_CMD.ISSUE_ASSET]: ({
      issuer,
      amount,
      recipient,
      memo
    }) => {

      const issueAssetOp = ['issue_asset', {
        issuer: issuer,
        amount: amount,
        recipient: recipient,
        memo: memo || undefined,
        extensions: []
      }];

      return [issueAssetOp];
    }

  }
}

class GrapheneChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient) {
    super(GRAPHENE_OP_CMD_MAP(chainNodeClient));
  }
}


export default GrapheneChainOperationsRegistry;
