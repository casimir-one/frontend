import _ from 'lodash';

import deipRpc from '@deip/rpc-client';

import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { PROPOSAL_TYPES } from '@deip/research-group-service';

import { Singleton } from '@deip/toolbox';
import { ResearchGroupProposalVotingHttp } from './ResearchGroupProposalVotingHttp';
import { schemasMap } from './maps';


class ResearchGroupProposalVotingService extends Singleton {
  researchGroupProposalVotingHttp = ResearchGroupProposalVotingHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  // not used
  createProposal(privKey, username, groupId, stringifiedPayload, proposalType) {
    return deipRpc.broadcast.createProposalAsync(
      privKey,
      username,
      groupId,
      stringifiedPayload,
      proposalType,
      this._getProposalExpirationTime()
    )
      .then((block) => {
        let proposal = null;
        for (let i = 0; i < block.operations.length; i++) {
          const op = block.operations[i];
          const opName = op[0];
          const opPayload = op[1];
          if (opName === 'create_proposal') {
            if (opPayload.data === stringifiedPayload) {
              proposal = opPayload;
              break;
            }
          }
        }
        if (proposal) {
          proposal.data = JSON.parse(proposal.data);
        }
      });
  }

  _getStringifiedProposalData(type, params) {
    if (schemasMap[type] === undefined) {
      throw 'Unknown proposal type';
    }
    return JSON.stringify(schemasMap[type](...params));
  }

  _getProposalExpirationTime() {
    return new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
  }

  approveProposal(propData) {
    const vote = {
      voter: this.accessService.getDecodedToken().username,
      research_group_id: propData.groupId,
      proposal_id: propData.requestId
    };
    const operation = ['vote_proposal', vote];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendVoteForProposal(signedTx));
  }

  // //////////////

  createInviteProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.INVITE_MEMBER, [
      propData.invitee,
      propData.rgtAmount,
      propData.coverLetter,
      propData.isHead
    ]);

    const proposal = {
      creator: this.accessService.getDecodedToken().username,
      research_group_id: propData.groupId,
      data,
      action: PROPOSAL_TYPES.INVITE_MEMBER,
      expiration_time: this._getProposalExpirationTime()
    };

    const operation = ['create_proposal', proposal];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendInviteProposal(signedTx));
  }

  createExcludeProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.EXCLUDE_MEMBER, [
      propData.name
    ]);

    const proposal = {
      creator: this.accessService.getDecodedToken().username,
      research_group_id: propData.groupId,
      data,
      action: PROPOSAL_TYPES.EXCLUDE_MEMBER,
      expiration_time: this._getProposalExpirationTime()
    };

    const operation = ['create_proposal', proposal];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendExcludeProposal(signedTx));
  }

  createSendFundsProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.SEND_FUNDS, [
      propData.recipient,
      propData.funds
    ]);

    return deipRpc.broadcast.createProposalAsync(
      this.accessService.getOwnerWif(),
      this.accessService.getDecodedToken().username,
      propData.groupId,
      data,
      PROPOSAL_TYPES.SEND_FUNDS,
      this._getProposalExpirationTime()
    );
  }

  createResearchProposal(propData) {
    const meta = {
      videoSrc: propData.videoSrc,
      milestones: propData.milestones,
      partners: propData.partners,
      trl: propData.trl
    };

    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.START_RESEARCH, [
      propData.title,
      propData.description,
      propData.permlink,
      propData.reviewShare,
      5,
      propData.disciplines,
      propData.isPrivate
    ]);

    const proposal = {
      creator: this.accessService.getDecodedToken().username,
      research_group_id: propData.groupId,
      data,
      action: PROPOSAL_TYPES.START_RESEARCH,
      expiration_time: this._getProposalExpirationTime()
    };

    const operation = ['create_proposal', proposal];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendResearchProposal(signedTx, meta));
  }

  createChangeQuorumProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.CHANGE_QUORUM, [
      propData.action,
      propData.quorum
    ]);

    return deipRpc.broadcast.createProposalAsync(
      this.accessService.getOwnerWif(),
      this.accessService.getDecodedToken().username,
      propData.groupId,
      data,
      PROPOSAL_TYPES.CHANGE_QUORUM,
      this._getProposalExpirationTime()
    );
  }

  createChangeGroupNameAndDescriptionProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.CHANGE_RESEARCH_GROUP_META_DATA_TYPE, [
      propData.newResearchGroupName,
      propData.newResearchGroupDescription
    ]);

    return deipRpc.broadcast.createProposalAsync(
      this.accessService.getOwnerWif(),
      this.accessService.getDecodedToken().username,
      propData.groupId,
      data,
      PROPOSAL_TYPES.CHANGE_RESEARCH_GROUP_META_DATA_TYPE,
      this._getProposalExpirationTime()
    );
  }

  createChangeResearchNameAndDescriptionProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.CHANGE_RESEARCH_META_DATA_TYPE, [
      propData.researchId,
      propData.newResearchTitle,
      propData.newResearchAbstract,
      propData.isPrivate
    ]);

    return deipRpc.broadcast.createProposalAsync(
      this.accessService.getOwnerWif(),
      this.accessService.getDecodedToken().username,
      propData.researchGroupId,
      data,
      PROPOSAL_TYPES.CHANGE_RESEARCH_META_DATA_TYPE,
      this._getProposalExpirationTime()
    );
  }

  createContentProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL, [
      propData.contentRef.researchId, propData.contentType, propData.contentRef.title,
      propData.contentRef.title.replace(/ /g, '-').replace(/_/g, '-').toLowerCase(),
      `${propData.contentRef.type}:${propData.contentRef.hash}`, propData.contentRef.authors, propData.contentRef.references, []
    ]);

    const proposal = {
      creator: this.accessService.getDecodedToken().username,
      research_group_id: propData.contentRef.researchGroupId,
      data,
      action: PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL,
      expiration_time: this._getProposalExpirationTime()
    };

    const operation = ['create_proposal', proposal];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendContentProposal(signedTx, propData.contentRef.type));
  }

  createTokenSaleProposal(propData) {
    const data = this._getStringifiedProposalData(PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE, [
      propData.researchId, propData.startDate, propData.endDate, propData.amount, propData.softCap, propData.hardCap
    ]);

    const proposal = {
      creator: this.accessService.getDecodedToken().username,
      research_group_id: propData.groupId,
      data,
      action: PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE,
      expiration_time: this._getProposalExpirationTime()
    };

    const operation = ['create_proposal', proposal];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchGroupProposalVotingHttp.sendTokenSaleProposal(signedTx));
  }
}

export {
  ResearchGroupProposalVotingService
};
