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
  
  createResearchGroup(privKey, {
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


  updateResearchGroupAccount({ privKey, username }, isProposal, {
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
        creator: username,
        proposedOps: [{ "op": update_account_op }],
        expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal({ privKey, username }, false, proposal)
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

  createResearchGroupInvite({ privKey, username }, {
    member,
    researchGroup,
    rewardShare,
    researches,
    extensions
  }, { notes }) {

    const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;
    const offchainMeta = { notes }

    const join_research_group_membership_op = ['join_research_group_membership', {
      member,
      research_group: researchGroup,
      reward_share: rewardShare,
      researches,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ "op": join_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    }

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => {
        return this.researchGroupHttp.createResearchGroupInvite({ tx: signedProposalTx, offchainMeta })
      })
  }
  
  leaveResearchGroup(
    { privKey, username }, 
    {
      member,
      researchGroup,
      isExclusion,
      extensions
    }, 
    {
      notes
    }
  ) {

    const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;
    const offchainMeta = { notes }

    const leave_research_group_membership_op = ['leave_research_group_membership', {
      member,
      research_group: researchGroup,
      is_exclusion: isExclusion,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ "op": leave_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    }

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => {
        return this.researchGroupHttp.leaveResearchGroup({ tx: signedProposalTx, offchainMeta })
      })
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
