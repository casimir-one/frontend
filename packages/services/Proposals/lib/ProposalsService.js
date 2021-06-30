import deipRpc from '@deip/rpc-client';
import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { proxydi } from '@deip/proxydi';
import { Singleton } from '@deip/toolbox';
import { UpdateProposalCmd, DeclineProposalCmd } from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { ChainService } from '@deip/chain-service';
import { ProposalsHttp } from './ProposalsHttp';

class ProposalsService extends Singleton {
  proposalsHttp = ProposalsHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance(); // deprecated

  proxydi = proxydi;

  deipRpc = deipRpc; // deprecated

  createProposal({ privKey, username }, propagate, {
    creator,
    proposedOps,
    expirationTime,
    reviewPeriodSeconds,
    extensions,
    approvers = [username]
  },
  refBlockData = {},
  preOps = [],
  postOps = []) {
    const { refBlockNum, refBlockPrefix } = refBlockData;
    const refBlockPromise = refBlockNum && refBlockPrefix
      ? Promise.resolve({ refBlockNum, refBlockPrefix })
      : this.blockchainService.getRefBlockSummary();

    return refBlockPromise
      .then((refBlock) => {
        const [proposalExternalId, createProposalOp] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator,
          proposed_ops: proposedOps,
          expiration_time: expirationTime,
          review_period_seconds: reviewPeriodSeconds,
          extensions
        }], refBlock);

        const approvalsToAdd = approvers || [];

        for (let i = 0; i < approvalsToAdd.length; i++) {
          const name = approvalsToAdd[i];
          const updateProposalOp = ['update_proposal', {
            external_id: proposalExternalId,
            active_approvals_to_add: [name],
            active_approvals_to_remove: [],
            owner_approvals_to_add: [],
            owner_approvals_to_remove: [],
            key_approvals_to_add: [],
            key_approvals_to_remove: [],
            extensions: []
          }];
          postOps.unshift(updateProposalOp);
        }

        const isTenantSign = approvalsToAdd.some((name) => name === this.proxydi.get('env').TENANT);
        return this.blockchainService.signOperations(
          [...preOps, createProposalOp, ...postOps], privKey, refBlock, isTenantSign
        )
          .then((signedTx) => (propagate
            ? this.proposalsHttp.createProposal({ tx: signedTx })
            : Promise.resolve({ tx: signedTx })));
      });
  }

  updateProposalLegacy({ privKey }, {
    externalId,
    activeApprovalsToAdd = [],
    activeApprovalsToRemove = [],
    ownerApprovalsToAdd = [],
    ownerApprovalsToRemove = [],
    keyApprovalsToAdd = [],
    keyApprovalsToRemove = [],
    extensions = []
  }, propagate = true) {
    const operation = ['update_proposal', {
      external_id: externalId,
      active_approvals_to_add: activeApprovalsToAdd,
      active_approvals_to_remove: activeApprovalsToRemove,
      owner_approvals_to_add: ownerApprovalsToAdd,
      owner_approvals_to_remove: ownerApprovalsToRemove,
      key_approvals_to_add: keyApprovalsToAdd,
      key_approvals_to_remove: keyApprovalsToRemove,
      extensions
    }];

    const isTenantSign = [
      ...activeApprovalsToAdd,
      ...activeApprovalsToRemove,
      ...ownerApprovalsToAdd,
      ...ownerApprovalsToRemove
    ].some((name) => name === this.proxydi.get('env').TENANT);

    return this.blockchainService.signOperations([operation], privKey, {}, isTenantSign)
      .then((signedTx) => (propagate
        ? this.proposalsHttp.updateProposalLegacy({ tx: signedTx })
        : Promise.resolve({ tx: signedTx })));
  }

  deleteProposalLegacy({ privKey }, {
    externalId,
    account,
    authority,
    extensions
  }, propagate = true) {
    const operation = ['delete_proposal', {
      external_id: externalId,
      account,
      authority,
      extensions
    }];

    const isTenantSign = [account].some((name) => name === this.proxydi.get('env').TENANT);
    return this.blockchainService.signOperations([operation], privKey, {}, isTenantSign)
      .then((signedTx) => (propagate
        ? this.proposalsHttp.deleteProposalLegacy({ tx: signedTx })
        : Promise.resolve({ tx: signedTx })));
  }

  updateProposal({ privKey }, {
    proposalId,
    activeApprovalsToAdd = [],
    activeApprovalsToRemove = [],
    ownerApprovalsToAdd = [],
    ownerApprovalsToRemove = [],
    keyApprovalsToAdd = [],
    keyApprovalsToRemove = []
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: proposalId,
              activeApprovalsToAdd,
              activeApprovalsToRemove,
              ownerApprovalsToAdd,
              ownerApprovalsToRemove,
              keyApprovalsToAdd,
              keyApprovalsToRemove
            });

            txBuilder.addCmd(updateProposalCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.proposalsHttp.updateProposal(msg);
          });
      });
  }

  declineProposal({ privKey }, {
    proposalId,
    account,
    authorityType
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const declineProposalCmd = new DeclineProposalCmd({
              entityId: proposalId,
              account,
              authorityType
            });

            txBuilder.addCmd(declineProposalCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.proposalsHttp.declineProposal(msg);
          });
      });
  }

  getProposalsByCreator(account) {
    return this.deipRpc.api.getProposalsByCreatorAsync(account)
      .then((result) => {
        const proposals = result.map((proposal) => {
          const { proposed_transaction: { operations: [[opName, opPayload]] } } = proposal;
          const opTag = deipRpc.operations.getOperationTag(opName);
          return { ...proposal, action: opTag, payload: opPayload };
        });
        return proposals;
      });
  }

  getAccountProposals(account, status = 0) {
    return this.proposalsHttp.getAccountProposals(account, status);
  }

  getProposal(externalId) {
    return this.proposalsHttp.getProposal(externalId);
  }
}

export {
  ProposalsService
};
