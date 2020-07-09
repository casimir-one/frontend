import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';

import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ResearchGroupHttp } from './ResearchGroupHttp';
import { ProposalsService } from '@deip/proposals-service';

class ResearchGroupService extends Singleton {
  researchGroupHttp = ResearchGroupHttp.getInstance();
  accessService = AccessService.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  _mapResearchGroup(rg) {
    return { ...rg };
  }
  
  createResearchGroupViaOffchain(privKey, { 
      fee,
      creator,
      accountOwnerAuth,
      accountActiveAuth,
      accountMemoPubKey,
      accountJsonMetadata,
      accountExtensions
  }, {
      researchGroupName,
      researchGroupDescription,
      researchGroupThresholdOverrides
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {
        
        const [research_group_external_id, create_account_op] = deipRpc.operations.createEntityOperation(['create_account', {
          fee,
          creator,
          owner: accountOwnerAuth,
          active: accountActiveAuth,
          active_overrides: researchGroupThresholdOverrides,
          memo_key: accountMemoPubKey,
          json_metadata: accountJsonMetadata,
          traits: [[
            "research_group",
            {
              name: researchGroupName,
              description: researchGroupDescription,
              extensions: []
            }
          ]],
          extensions: accountExtensions
        }], refBlock);

        const offchainMeta = {};

        return this.blockchainService.signOperations([create_account_op], privKey, refBlock)
          .then((signedTx) => {
            return this.researchGroupHttp.createResearchGroup({ tx: signedTx, offchainMeta })
          })
      })
  }


  updateResearchGroupAccountViaOffchain(privKey, isProposal, {
    researchGroup,
    accountOwnerAuth,
    accountActiveAuth,
    accountActiveAuthOverrides,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  }, {
    researchGroupName,
    researchGroupDescription,
  }) {

    const offchainMeta = {};

    const update_account_op = ['update_account', {
      account: researchGroup,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      active_overrides: accountActiveAuthOverrides,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: [[
        "research_group",
        {
          name: researchGroupName,
          description: researchGroupDescription,
          extensions: []
        }
      ]],
      extensions: accountExtensions
    }];


    if (isProposal) {

      const proposal = {
        creator: researchGroup,
        proposedOps: [{ "op": update_account_op }],
        expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal(privKey, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          return this.researchGroupHttp.updateResearchGroup({ tx: signedProposalTx, offchainMeta, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([update_account_op], privKey)
        .then((signedTx) => {
          return this.researchGroupHttp.updateResearchGroup({ tx: signedTx, offchainMeta, isProposal })
        })

    }
  }

  createResearchGroupInviteViaOffchain(privKey, {
    member,
    researchGroup,
    rewardShare,
    researches,
    extensions
  }, {
    notes,
    approver
  }) {

    const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;
    const offchainMeta = { notes, approver }

    return Promise.all([
      this.blockchainService.getRefBlockSummary(),
      deipRpc.api.getAccountsAsync([researchGroup])
    ])
      .then(([refBlock, [researchGroupAccount]]) => {

        const join_research_group_membership_op = ['join_research_group_membership', {
          member,
          research_group: researchGroup,
          reward_share: rewardShare,
          researches,
          extensions
        }];

        // set permissions for user in this account
        const update_account_op = ['update_account', {
          account: researchGroup,
          owner: undefined,
          active: {
            account_auths: [...researchGroupAccount.active.account_auths, [member, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active_overrides: undefined,
          memo_key: undefined,
          json_metadata: undefined,
          traits: undefined,
          extensions: []
        }];

        const [proposal_external_id, create_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researchGroup,
          proposed_ops: [
            { "op": join_research_group_membership_op },
            { "op": update_account_op }
          ],
          expiration_time: proposalExpiration,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);


        const operations = [create_proposal_op];

        if (approver) {

          const update_proposal_op = ['update_proposal', {
            external_id: proposal_external_id,
            active_approvals_to_add: [approver],
            active_approvals_to_remove: [],
            owner_approvals_to_add: [],
            owner_approvals_to_remove: [],
            key_approvals_to_add: [],
            key_approvals_to_remove: [],
            extensions: []
          }];
          
          operations.push(update_proposal_op);
        }

        return this.blockchainService.signOperations(operations, privKey, refBlock)
          .then((signedTx) => {
            return this.researchGroupHttp.createResearchGroupInvite({ tx: signedTx, offchainMeta })
          })
      })
  }

  approveResearchGroupInviteViaOffChain(privKey, {
    inviteId,
    account
  }) {
    
    const update_proposal_op = ['update_proposal', {
      external_id: inviteId,
      active_approvals_to_add: [account],
      active_approvals_to_remove: [],
      owner_approvals_to_add: [],
      owner_approvals_to_remove: [],
      key_approvals_to_add: [],
      key_approvals_to_remove: [],
      extensions: []
    }];

    return this.blockchainService.signOperations([update_proposal_op], privKey)
      .then((signedTx) => {
        return this.researchGroupHttp.approveResearchGroupInvite({ tx: signedTx });
      });
  }

  rejectResearchGroupInviteViaOffChain(privKey, {
    inviteId,
    account
  }) {

    const delete_proposal_op = ['delete_proposal', {
      external_id: inviteId,
      account: account,
      authority: 2, // active
      extensions: []
    }]

    return this.blockchainService.signOperations([delete_proposal_op], privKey)
      .then((signedTx) => {
        return this.researchGroupHttp.rejectResearchGroupInvite({ tx: signedTx });
      });
  }


  leftResearchGroupViaOffchain(privKey, {
    member,
    researchGroup,
    isExclusion,
    extensions
  }, {
    notes,
    approver
  }) {

    const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;
    const offchainMeta = { notes, approver }

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const left_research_group_membership_op = ['left_research_group_membership', {
          member,
          research_group: researchGroup,
          is_exclusion: isExclusion,
          extensions
        }];

        const [proposal_external_id, create_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researchGroup,
          proposed_ops: [
            { "op": left_research_group_membership_op },
          ],
          expiration_time: proposalExpiration,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);

        const operations = [create_proposal_op];

        if (approver) {

          const update_proposal_op = ['update_proposal', {
            external_id: proposal_external_id,
            active_approvals_to_add: [approver],
            active_approvals_to_remove: [],
            owner_approvals_to_add: [],
            owner_approvals_to_remove: [],
            key_approvals_to_add: [],
            key_approvals_to_remove: [],
            extensions: []
          }];

          operations.push(update_proposal_op);
        }

        return this.blockchainService.signOperations(operations, privKey, refBlock)
          .then((signedTx) => {
            return this.researchGroupHttp.leftResearchGroup({ tx: signedTx, offchainMeta, isProposal: true })
          })

      });
  }

  getResearchGroupPendingInvites(researchGroupExternalId) {
    return this.researchGroupHttp.getResearchGroupPendingInvites(researchGroupExternalId);
  }

  /* [DEPRECATED] */
  getResearchGroupById(groupId) {
    return deipRpc.api.getResearchGroupByIdAsync(groupId)
      .then(this._mapResearchGroup);
  }

  /* [DEPRECATED] */
  getResearchGroupByPermlink(permlink) {
    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
      .then(this._mapResearchGroup);
  }

  getResearchGroup(externalId) {
    return this.researchGroupHttp.getResearchGroup(externalId);
  }

  /* [DEPRECATED] */
  getActivityLogsEntriesByResearchGroup(researchGroupExternalId) {
    return this.researchGroupHttp.getActivityLogsEntriesByResearchGroup(researchGroupExternalId);
  }

  // /////////////////

  getJoinRequestsByGroup(groupId) {
    return this.researchGroupHttp.getJoinRequestsByGroup(groupId);
  }

  getJoinRequestsByUser(username) {
    return this.researchGroupHttp.getJoinRequestsByUser(username);
  }

  createJoinRequest(data) {
    return this.researchGroupHttp.createJoinRequest(data);
  }

  updateJoinRequest(update) {
    return this.researchGroupHttp.updateJoinRequest(update);
  }

  checkResearchGroupExistenceByPermlink(name) {
    return deipRpc.api.checkResearchGroupExistenceByPermlinkAsync(name)
  }
  
}

export {
  ResearchGroupService
};
