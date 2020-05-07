import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
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
      accountPostingAuth,
      accountMemoPubKey,
      accountJsonMetadata,
      accountExtensions
  }, {
      researchGroupName,
      researchGroupPermlink,
      researchGroupDescription,
      researchGroupThresholdOverrides
  }) {

    // TODO: create buffer hash serializer
    let encodeUint8Arr = (inputString) => new TextEncoder('utf-8').encode(inputString);
    let researchGroupAccount = crypto.hexify(crypto.ripemd160(encodeUint8Arr(`${researchGroupName}${researchGroupPermlink}${researchGroupDescription}${creator}${new Date().getTime()}`).buffer));

    let researchGroupTrait = [
      "research_group_v1_0_0",
      {
        "_v": "1.0.0",
        "name": researchGroupName,
        "permlink": researchGroupPermlink,
        "description": researchGroupDescription,
        "threshold_overrides": researchGroupThresholdOverrides
      }
    ];

    const op = {
      fee,
      creator,
      new_account_name: researchGroupAccount,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      posting: accountPostingAuth,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: [ researchGroupTrait ],
      extensions: accountExtensions
    }

    const offchainMeta = {};

    const operation = ['create_account', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((signedTx) => {
        return this.researchGroupHttp.createResearchGroup({ tx: signedTx, offchainMeta })
      })
  }


  updateResearchGroupAccountViaOffchain(privKey, isProposal, {
    researchGroup,
    accountOwnerAuth,
    accountActiveAuth,
    accountPostingAuth,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  }, {
    researchGroupName,
    researchGroupPermlink,
    researchGroupDescription,
    researchGroupThresholdOverrides
  }) {

    let researchGroupTrait = [
      "research_group_v1_0_0",
      {
        "_v": "1.0.0",
        "name": researchGroupName,
        "permlink": researchGroupPermlink,
        "description": researchGroupDescription,
        "threshold_overrides": researchGroupThresholdOverrides
      }
    ];

    const op = {
      account: researchGroup,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      posting: accountPostingAuth,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: [researchGroupTrait],
      extensions: accountExtensions
    }

    const offchainMeta = {};

    const operation = ['update_account', op];

    if (isProposal) {

      const proposal = {
        creator: researchGroup,
        proposedOps: [{ "op": operation }],
        expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal(privKey, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          return this.researchGroupHttp.updateResearchGroup({ tx: signedProposalTx, offchainMeta, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([operation], privKey)
        .then((signedTx) => {
          return this.researchGroupHttp.updateResearchGroup({ tx: signedTx, offchainMeta, isProposal })
        })

    }
  }

  
  createResearchGroupInviteViaOffchain(privKey, isProposal, {
    member,
    research_group,
    is_invitation,
    reward_share,
    researches,
    extensions
  }, {
    notes
  }) {

    const op = {
      member,
      research_group,
      is_invitation,
      reward_share,
      researches,
      extensions
    }

    const offchainMeta = {
      notes
    }

    const operation = ['join_research_group_membership', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((tx) => {
        // let signedTx = deipRpc.auth.signTransaction(tx, { owner: "5JGoCjh27sfuCzp7kQme5yMipaQtgdVLPiZPr9zaCwJVrSrbGYx" }); // member
        return this.researchGroupHttp.createResearchGroupInvite({ tx: tx, offchainMeta, isProposal })
      })
  }


  leftResearchGroupViaOffchain(privKey, isProposal, {
    member,
    research_group,
    is_exclusion,
    extensions
  }, {
    notes
  }) {

    const op = {
      member,
      research_group,
      is_exclusion,
      extensions
    }

    const offchainMeta = {
      notes
    }

    const operation = ['left_research_group_membership', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((signedTx) => this.researchGroupHttp.leftResearchGroup({ tx: signedTx, offchainMeta, isProposal }));
  }

  getAllResearchGroups(withPersonal = false) {
    return deipRpc.api.getAllResearchGroupsAsync(withPersonal)
      .then((groupsList) => groupsList.map(this._mapResearchGroup));
  }

  getResearchGroupById(groupId) {
    return deipRpc.api.getResearchGroupByIdAsync(groupId)
      .then(this._mapResearchGroup);
  }

  getResearchGroupByPermlink(permlink) {
    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
      .then(this._mapResearchGroup);
  }

  getResearchGroup(externalId) {
    return deipRpc.api.getResearchGroupAsync(externalId)
      .then(this._mapResearchGroup);
  }

  // not used
  getActivityLogsEntriesByResearchGroup(researchGroupId) {
    return this.researchGroupHttp.getActivityLogsEntriesByResearchGroup(researchGroupId);
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
  
}

export {
  ResearchGroupService
};
