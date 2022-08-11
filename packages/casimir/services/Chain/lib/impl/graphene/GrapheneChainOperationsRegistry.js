import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { APP_CMD } from '@casimir/platform-core';
import { toAssetUnits, millisecToIso } from './utils';


const GRAPHENE_OP_CMD_MAP = (chainNodeClient, {
  coreAsset
}) => {

  const crypto = require('@casimir/lib-crypto');

  return {

    [APP_CMD.CREATE_DAO]: ({
      entityId,
      isTeamAccount,
      fee,
      creator,
      description,
      authority
    }) => {

      const ownerAuths = {
        account_auths: [],
        key_auths: [],
        weight_threshold: authority.owner.weight
      };

      for (let i = 0; i < authority.owner.auths.length; i++) {
        let auth = authority.owner.auths[i];
        if (auth.name) {
          ownerAuths.account_auths.push([auth.name, auth.weight]);
        } else {
          ownerAuths.key_auths.push([auth.key, auth.weight]);
        }
      }

      const createAccountOp = ['create_account', {
        fee: fee ? toAssetUnits(fee) : toAssetUnits({ ...coreAsset, amount: 0 }),
        creator: creator,
        new_account_name: entityId,
        owner: ownerAuths,
        active: ownerAuths,
        active_overrides: [],
        memo_key: crypto.generateKeys().public, // @deprecated
        json_metadata: JSON.stringify({ description }),
        traits: isTeamAccount
          ? [["research_group", { description: "", extensions: [] }]] // @deprecated
          : [],
        extensions: []
      }];

      return [createAccountOp];
    },


    [APP_CMD.UPDATE_DAO]: ({
      entityId,
      description,
      isTeamAccount
    }) => {

      const updateAccountOp = ['update_account', {
        account: entityId,
        owner: undefined,
        active: undefined,
        active_overrides: undefined,
        memo_key: undefined,
        json_metadata: JSON.stringify({ description }),
        traits: isTeamAccount
          ? [["research_group", { description: "", extensions: [] }]] // @deprecated
          : [],
        update_extensions: []
      }];

      return [updateAccountOp];
    },

    [APP_CMD.ALTER_DAO_AUTHORITY]: ({
      entityId,
      authority
    }) => {

      const ownerAuth = {
        account_auths: [],
        key_auths: [],
        weight_threshold: authority.owner.weight
      };

      for (let i = 0; i < authority.owner.auths.length; i++) {
        let auth = authority.owner.auths[i];
        if (auth.name) {
          ownerAuth.account_auths.push([auth.name, auth.weight]);
        } else {
          ownerAuth.key_auths.push([auth.key, auth.weight]);
        }
      }


      const updateAccountOp = ['update_account', {
        account: entityId,
        owner: ownerAuth,
        active: ownerAuth,
        active_overrides: undefined,
        memo_key: undefined,
        json_metadata: undefined,
        traits: undefined,
        update_extensions: []
      }];

      return [updateAccountOp];
    },


    [APP_CMD.ADD_DAO_MEMBER]: ({
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


    [APP_CMD.REMOVE_DAO_MEMBER]: ({
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
        expiration_time: millisecToIso(expirationTime),
        review_period_seconds: reviewPeriodSeconds || undefined
      }];

      return [createProposalOp];
    },


    [APP_CMD.ACCEPT_PROPOSAL]: ({
      entityId,
      account
    }) => {

      const updateProposalOp = ['update_proposal', {
        external_id: entityId,
        active_approvals_to_add: [],
        active_approvals_to_remove: [],
        owner_approvals_to_add: [account],
        owner_approvals_to_remove: [],
        key_approvals_to_add: [],
        key_approvals_to_remove: [],
        extensions: []
      }];

      return [updateProposalOp];
    },


    [APP_CMD.DECLINE_PROPOSAL]: ({
      entityId,
      account
    }) => {

      const declineProposalOp = ['delete_proposal', {
        external_id: entityId,
        account: account,
        authority: 2,
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

      const tokensOnSale = shares.map(s => toAssetUnits(s));
      const softCapUnits = toAssetUnits(softCap);
      const hardCapUnits = toAssetUnits(hardCap);
      const isoStartTime = millisecToIso(startTime);
      const isoEndTime = millisecToIso(endTime);

      const createInvestmentOppOp = ['create_research_token_sale', {
        external_id: entityId,
        research_group: teamId,
        research_external_id: projectId,
        start_time: isoStartTime,
        end_time: isoEndTime,
        security_tokens_on_sale: tokensOnSale,
        soft_cap: softCapUnits,
        hard_cap: hardCapUnits,
        extensions: []
      }];

      return [createInvestmentOppOp];
    },


    [APP_CMD.INVEST]: ({
      investmentOpportunityId,
      investor,
      asset
    }) => {

      const amountUnits = toAssetUnits(asset);
      const investOp = ['contribute_to_token_sale', {
        token_sale_external_id: investmentOpportunityId,
        contributor: investor,
        amount: amountUnits,
        extensions: []
      }];

      return [investOp];
    },


    [APP_CMD.TRANSFER_FT]: ({
      from,
      to,
      tokenId,
      symbol,
      precision,
      amount,
    }) => {
      
      const amountUnits = toAssetUnits({ symbol, precision, amount });
      const transferOp = ['transfer', {
        from: from,
        to: to,
        amount: amountUnits,
        memo: "",
        extensions: []
      }];
    
      return [transferOp];
    },


    [APP_CMD.TRANSFER_NFT]: ({
      from,
      to,
      asset
    }) => {
      throw Error(`Not implemented exception`);
    },


    [APP_CMD.CREATE_FT]: ({
      entityId,
      issuer,
      symbol,
      name,
      precision,
      maxSupply,
      description,
      minBalance,
      metadata
    }) => {

      const traits = [];

      const createFungibleTokenOp = ['create_asset', {
        issuer: issuer,
        symbol: symbol,
        precision: precision,
        description: description,
        max_supply: maxSupply,
        traits: traits,
        extensions: []
      }];

      return [createFungibleTokenOp];
    },


    [APP_CMD.CREATE_NFT_COLLECTION]: ({
      issuer,
      symbol,
      precision,
      description,
      maxSupply,
      projectTokenSettings
    }) => {
      throw Error(`Not implemented exception`);
    },


    [APP_CMD.ISSUE_FT]: ({
      issuer,
      tokenId,
      symbol,
      precision,
      amount,
      recipient,
      memo
    }) => {
      const amountUnits = toAssetUnits({ symbol, precision, amount });

      const issueFungibleTokenOp = ['issue_asset', {
        issuer: issuer,
        amount: amountUnits,
        recipient: recipient,
        memo: memo || undefined,
        extensions: []
      }];

      return [issueFungibleTokenOp];
    },


    [APP_CMD.CREATE_NFT_ITEM]: ({
      issuer,
      asset,
      recipient,
      memo
    }) => {
      throw Error(`Not implemented exception`);
    },


    [APP_CMD.CREATE_CONTRACT_AGREEMENT]: ({
      entityId,
      creator,
      parties,
      hash,
      activationTime,
      expirationTime,
      type,
      terms
    }) => {

      const createContractAgreementOp = ['create_contract_agreement', {
        external_id: entityId,
        creator: creator,
        parties: parties,
        hash: hash,
        start_time: activationTime ? millisecToIso(activationTime) : undefined,
        end_time: expirationTime ? millisecToIso(expirationTime) : undefined,
        terms: [], // will be populated with terms meta
        extensions: []
      }];

      return [createContractAgreementOp];
    },


    [APP_CMD.ACCEPT_CONTRACT_AGREEMENT]: ({
      entityId,
      party
    }) => {

      const acceptContractAgreementOp = ['accept_contract_agreement', {
        external_id: entityId,
        party: party,
        extensions: []
      }];

      return [acceptContractAgreementOp];
    },


    [APP_CMD.REJECT_CONTRACT_AGREEMENT]: ({
      entityId,
      party
    }) => {

      const rejectContractAgreementOp = ['reject_contract_agreement', {
        external_id: entityId,
        party: party,
        extensions: []
      }];

      return [rejectContractAgreementOp];
    },
    

    [APP_CMD.CREATE_PORTAL]: ({
      entityId,
      owner,
      delegate,
      metadata
    }) => {

      const createPortalOp = ['create_account', {
        fee: toAssetUnits({ ...coreAsset, amount: 0 }),
        creator: owner,
        new_account_name: entityId,
        owner: {
          account_auths: [[owner, 1]],
          key_auths: [],
          weight_threshold: 1
        },
        active: {
          account_auths: [[delegate, 1]],
          key_auths: [],
          weight_threshold: 1
        },
        active_overrides: [],
        memo_key: crypto.generateKeys().public, // @deprecated
        json_metadata: JSON.stringify({ metadata }),
        traits: [["research_group", { description: "", extensions: [] }]], // @deprecated
        extensions: []
      }];

      return [createPortalOp];

    }

  }
}

class GrapheneChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient, settings) {
    super(GRAPHENE_OP_CMD_MAP(chainNodeClient, settings));
  }
}


export default GrapheneChainOperationsRegistry;
