import { proxydi } from '@deip/proxydi';
import { UpdateProposalCmd, DeclineProposalCmd } from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { ChainService } from '@deip/chain-service';
import { createInstanceGetter } from '@deip/toolbox';
import { ProposalsHttp } from './ProposalsHttp';

export class ProposalsService {
  proposalsHttp = ProposalsHttp.getInstance();

  proxydi = proxydi;

  // TODO: add createProposal endpoint and support proposal of APP_PROPOSAL.CUSTOM type

  async updateProposal({ privKey }, {
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
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
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

  async declineProposal({ privKey }, {
    proposalId,
    account,
    authorityType
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
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

  async getProposalsByCreator(account) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getProposalsByCreatorAsync(account)
          .then((result) => {
            const proposals = result.map((proposal) => {
              const { proposed_transaction: { operations: [[opName, opPayload]] } } = proposal;
              const opTag = deipRpc.operations.getOperationTag(opName);
              return { ...proposal, action: opTag, payload: opPayload };
            });
            return proposals;
          });
      });
  }

  async getAccountProposals(account, status = 0) {
    return this.proposalsHttp.getAccountProposals(account, status);
  }

  async getProposal(externalId) {
    return this.proposalsHttp.getProposal(externalId);
  }

  /** @type {() => ProposalsService} */
  static getInstance = createInstanceGetter(ProposalsService);
}
