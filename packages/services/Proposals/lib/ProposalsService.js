import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';

import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';

import { Singleton } from '@deip/toolbox';
import { ProposalsHttp } from './ProposalsHttp';
import { extenderMap } from './maps';

class ProposalsService extends Singleton {
  proposalsHttp = ProposalsHttp.getInstance();
  accessService = AccessService.getInstance();
  blockchainService = BlockchainService.getInstance();

  createProposal(privKey, propagate, {
    creator,
    proposedOps,
    expirationTime,
    reviewPeriodSeconds,
    extensions
  }) {

    // TODO: move to buffer hash serializer
    const encodeUint8Arr = (inputString) => new TextEncoder('utf-8').encode(inputString);
    const externalId = crypto.hexify(crypto.ripemd160(encodeUint8Arr(`${creator}${JSON.stringify(proposedOps)}${expirationTime}${reviewPeriodSeconds}${new Date().getTime()}`).buffer));

    const op = {
      external_id: externalId,
      creator: creator,
      proposed_ops: proposedOps,
      expiration_time: expirationTime,
      review_period_seconds: reviewPeriodSeconds,
      extensions
    }

    const operation = ['create_proposal', op];
    return this.blockchainService.signOperations([ operation ], privKey)
      .then((signedTx) => {
        return propagate 
          ? this.proposalsHttp.createProposal({ tx: signedTx }) 
          : Promise.resolve({ tx: signedTx });
      })
  }


  updateProposal(privKey, {
    externalId,
    postingApprovalsToAdd,
    postingApprovalsToRemove,
    activeApprovalsToAdd,
    activeApprovalsToRemove,
    ownerApprovalsToAdd,
    ownerApprovalsToRemove,
    keyApprovalsToAdd,
    keyApprovalsToRemove,
    extensions
  }) {

    const op = {
      external_id: externalId,
      posting_approvals_to_add: postingApprovalsToAdd,
      posting_approvals_to_remove: postingApprovalsToRemove,
      active_approvals_to_add: activeApprovalsToAdd,
      active_approvals_to_remove: activeApprovalsToRemove,
      owner_approvals_to_add: ownerApprovalsToAdd,
      owner_approvals_to_remove: ownerApprovalsToRemove,
      key_approvals_to_add: keyApprovalsToAdd,
      key_approvals_to_remove: keyApprovalsToRemove,
      extensions
    }

    const operation = ['update_proposal', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((signedTx) => {
        return this.proposalsHttp.updateProposal({ tx: signedTx });
      });
  }

  deleteProposal(privKey, {
    externalId,
    account,
    authority,
    extensions
  }) {

    const op = {
      external_id: externalId,
      account,
      authority,
      extensions
    }

    const operation = ['delete_proposal', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((signedTx) => {
        return this.proposalsHttp.deleteProposal({ tx: signedTx });
      });
  }

  getProposalsByCreator(account) {
    return deipRpc.api.getProposalsByCreatorAsync(account)
      .then((proposals) => {
        return Promise.all(proposals.map((item) => {
          return this.getProposalDetails(item);
        }))
      })
  }

  getProposalDetails(proposal) {
    const { proposed_transaction: { operations: [ [ op_name, op_payload ], ...rest ] } } = proposal;

    const op_tag = deipRpc.formatter.getOperationTag(op_name);
    const extender = extenderMap[op_tag];

    if (!extender) {
      return Promise.resolve({ ...proposal, action: op_tag, payload: op_payload });
    }

    let extendedProposal = { ...proposal, action: op_tag, payload: op_payload, extension: {} };

  
    let extensions = Object.keys(extender);
    
    return Promise.all(extensions.map(ext => {
      let func = extender[ext];
      return func(op_payload)
    }))
    .then((data) => {
      return extensions.reduce((o, ext, i) => {
        return { ...o, extension: { ...o.extension, [ext]: data[i] } };
      }, extendedProposal);
    });
  }

}

export {
  ProposalsService
};
