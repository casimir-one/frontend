import { proxydi } from '@deip/proxydi';
import { AcceptProposalCmd, DeclineProposalCmd } from '@deip/commands';
import { JsonDataMsg } from '@deip/messages';
import { ChainService } from '@deip/chain-service';
import { createInstanceGetter } from '@deip/toolbox';
import { PROTOCOL_CHAIN } from '@deip/constants';
import { ProposalsHttp } from './ProposalsHttp';

export class ProposalsService {
  proposalsHttp = ProposalsHttp.getInstance();
  proxydi = proxydi;

  // TODO: add createProposal endpoint and support proposal of APP_PROPOSAL.CUSTOM type

  async accept({ privKey }, {
    proposalId,
    account
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const updateProposalCmd = new AcceptProposalCmd({
              entityId: proposalId,
              account
            });
            txBuilder.addCmd(updateProposalCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.proposalsHttp.accept(msg);
          });
      });
  }

  async decline({ privKey }, {
    proposalId,
    account
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
              account
            });

            txBuilder.addCmd(declineProposalCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.proposalsHttp.decline(msg);
          });
      });
  }

  async getListByCreator(account) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainRpc = chainService.getChainRpc();

        return chainRpc.getProposalsByCreatorAsync(account)
          .then((result) => {
            // TODO: move all mappings outside service
            if (env.PROTOCOL === PROTOCOL_CHAIN.GRAPHENE) {
              const deipRpc = chainService.getChainNodeClient();
              const proposals = result.map((proposal) => {
                const { operations: [[opName, opPayload]] } = proposal.serializedProposedTx;
                const opTag = deipRpc.operations.getOperationTag(opName);
                return { ...proposal, action: opTag, payload: opPayload };
              });
              return proposals;
            }
            return result;
          });
      });
  }

  async getListByAccount(account, status = 0) {
    return this.proposalsHttp.getListByAccount(account, status);
  }

  async getOne(id) {
    return this.proposalsHttp.getOne(id);
  }

  /** @type {() => ProposalsService} */
  static getInstance = createInstanceGetter(ProposalsService);
}
