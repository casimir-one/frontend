import _ from 'lodash';
import { Singleton } from '@deip/toolbox';

import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';

import { ResearchGroupHttp } from './ResearchGroupHttp';
import { ConfigMiddleware } from './ConfigMiddleware';

import { extenderMap } from './maps';

class ResearchGroupService extends Singleton {
  researchGroupHttp = ResearchGroupHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  ConfigMiddleware = ConfigMiddleware.getInstance();

  _methods = {};

  get deipRpc() {
    return this.ConfigMiddleware.deipRpc;
  }

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

  createResearchGroup({ name, permlink, description, type, details, isCreatedByOrganization, invitees }) {
    const researchGroupOpPayload = {
      creator: this.accessService.getDecodedToken().username,
      name,
      permlink,
      description,
      type,
      details,
      is_created_by_organization: isCreatedByOrganization,
      invitees
    };

    const operation = ['create_research_group', researchGroupOpPayload];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupHttp.sendCreateGroup(signedTx));
  }

  getAllResearchGroups(withPersonal = false) {
    return this.deipRpc.api.getAllResearchGroupsAsync(withPersonal)
      .then((groupsList) => groupsList.map(this._mapResearchGroup));
  }

  getResearchGroupById(groupId) {
    return this.deipRpc.api.getResearchGroupByIdAsync(groupId)
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
    return this._proposalMethod().createSendFundsProposal(data);
  }

  createResearchProposal(data) {
    return this._proposalMethod().createResearchProposal(data);
  }

  createChangeQuorumProposal(data) {
    return this._proposalMethod().createChangeQuorumProposal(data);
  }

  createChangeGroupNameAndDescriptionProposal(data) {
    return this._proposalMethod().createChangeGroupNameAndDescriptionProposal(data);
  }

  createChangeResearchNameAndDescriptionProposal(data) {
    return this._proposalMethod().createChangeResearchNameAndDescriptionProposal(data);
  }

  createContentProposal(data) {
    return this._proposalMethod().createContentProposal(data);
  }

  createTokenSaleProposal(data) {
    return this._proposalMethod().createTokenSaleProposal(data);
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
