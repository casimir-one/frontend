import _ from 'lodash';
import { Singleton } from '@deip/toolbox';

import deipRpc from '@deip/deip-oa-rpc-client';

import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';

import { ResearchGroupHttp } from './ResearchGroupHttp';
import { extenderMap } from './maps';

class ResearchGroupService extends Singleton {
  researchGroupHttp = ResearchGroupHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  _methods = {};

  setMethods(methods) {
    this._methods = { ...this._methods, ...methods };
  }

  _proposalMethod(method = 'voting') {
    return this._methods[method];
  }

  _mapResearchGroup(rg) {
    return { ...rg };
  }

  // /////////////////

  createResearchGroup(name, permlink, description, quorumPercent, proposalQuorums, invitees) {
    const group = {
      creator: this.accessService.getDecodedToken().username,
      name,
      permlink,
      description,
      quorum_percent: quorumPercent,
      proposal_quorums: proposalQuorums,
      is_dao: true,
      invitees
    };

    const operation = ['create_research_group', group];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupHttp.sendCreateGroup(signedTx));
  }

  getAllResearchGroups(withPersonal = false) {
    return deipRpc.api.getAllResearchGroupsAsync(withPersonal)
      .then((groupsList) => groupsList.map(this._mapResearchGroup));
  }

  getResearchGroupById(groupId) {
    return deipRpc.api.getResearchGroupByIdAsync(groupId)
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

  // /////////////////

  extendProposalByRelatedInfo(proposal) {
    const extensionFuncs = extenderMap[proposal.action];

    proposal.extension = {};

    if (!extensionFuncs) {
      return Promise.resolve(proposal);
    }

    const fieldKeys = _.keys(extensionFuncs);

    // todo: a lot of the same queries go to server, so it should be optimized
    // by grouping the same queries in one and then populating necessery items
    // todo: use agregation services!!!
    return Promise.all(
      _.map(extensionFuncs, (func) => func(proposal))
    ).then((data) => {
      fieldKeys.forEach((key, i) => proposal.extension[key] = data[i]);

      return proposal;
    });
  }

  // /////////////////

  createInviteProposal(data) {
    return this._proposalMethod().createInviteProposal(data);
  }

  createDropoutProposal(data) {
    return this._proposalMethod().createDropoutProposal(data);
  }

  createSendFundsProposal(data) {
    this._proposalMethod().createSendFundsProposal(data);
  }

  createResearchProposal(data) {
    this._proposalMethod().createResearchProposal(data);
  }

  createChangeQuorumProposal(data) {
    this._proposalMethod().createChangeQuorumProposal(data);
  }

  createChangeGroupNameAndDescriptionProposal(data) {
    this._proposalMethod().createChangeGroupNameAndDescriptionProposal(data);
  }

  createChangeResearchNameAndDescriptionProposal(data) {
    this._proposalMethod().createChangeResearchNameAndDescriptionProposal(data);
  }

  createContentProposal(data) {
    this._proposalMethod().createContentProposal(data);
  }

  createTokenSaleProposal(data) {
    this._proposalMethod().createTokenSaleProposal(data);
  }

  //-----------------

  approveProposal(data) {
    return this._proposalMethod().approveProposal(data);
  }

  // /////////////////

  validateQuorumValue(value) {
    const intValue = parseInt(value);
    const isNumber = _.isFinite(intValue);

    return !isNumber || (isNumber && (intValue > 100 || intValue < 5));
  }
}

export {
  ResearchGroupService
};
