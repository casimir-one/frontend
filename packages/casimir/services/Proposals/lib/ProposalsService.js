import { proxydi } from '@casimir.one/proxydi';
import { AcceptProposalCmd, DeclineProposalCmd } from '@casimir.one/commands';
import { JsonDataMsg } from '@casimir.one/messages';
import { ChainService } from '@casimir.one/chain-service';
import { makeSingletonInstance } from '@casimir.one/toolbox';
import { ProtocolChain } from '@casimir.one/platform-core';
import { walletSignTx } from '@casimir.one/platform-util';
import { ProposalsHttp } from './ProposalsHttp';

/**
 *  Proposals data transport
 */
export class ProposalsService {
  proposalsHttp = ProposalsHttp.getInstance();
  proxydi = proxydi;

  // TODO: add createProposal endpoint and support proposal of APP_PROPOSAL.CUSTOM type

  /**
   * Accept proposal
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {Object} payload.data
   * @param {string} payload.data.proposalId
   * @param {string} payload.data.account
   * @returns {Promise<Object>}
   */
  async accept(payload) {
    const {
      initiator: { privKey },
      data: {
        proposalId,
        account
      }
    } = payload;
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainNodeClient = chainService.getChainNodeClient();

    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainRpc = chainService.getChainRpc();
    const proposal = await chainRpc.getProposalAsync(proposalId);
    const txBuilder = await chainTxBuilder.begin();

    const updateProposalCmd = new AcceptProposalCmd({
      entityId: proposalId,
      account,
      batchWeight: proposal.batchWeight
    });
    txBuilder.addCmd(updateProposalCmd);
    const packedTx = await txBuilder.end();

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.proposalsHttp.accept(msg);
  }

  /**
   * Decline proposal
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {Object} payload.data
   * @param {string} payload.data.proposalId
   * @param {string} payload.data.account
   * @returns {Promise<Object>}
   */
  async decline(payload) {
    const {
      initiator: { privKey },
      data: {
        proposalId,
        account
      }
    } = payload;
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainNodeClient = chainService.getChainNodeClient();

    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainRpc = chainService.getChainRpc();
    const proposal = await chainRpc.getProposalAsync(proposalId);
    const txBuilder = await chainTxBuilder.begin();

    const declineProposalCmd = new DeclineProposalCmd({
      entityId: proposalId,
      account,
      batchWeight: proposal.batchWeight
    });

    txBuilder.addCmd(declineProposalCmd);
    const packedTx = await txBuilder.end();

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.proposalsHttp.decline(msg);
  }

  /**
   * [DEPREACTED]
   * Get proposals by creator
   * @param {string} account
   * @returns {Promise<Object>}
   */
  async getListByCreator(account) {
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainRpc = chainService.getChainRpc();

    const result = await chainRpc.getProposalsByCreatorAsync(account);

    if (env.PROTOCOL === ProtocolChain.GRAPHENE) {
      const deipRpc = chainService.getChainNodeClient();
      const proposals = result.map((proposal) => {
        const { operations: [[opName, opPayload]] } = proposal.serializedProposedTx;
        const opTag = deipRpc.operations.getOperationTag(opName);
        return { ...proposal, action: opTag, payload: opPayload };
      });
      return proposals;
    }

    return result;
  }

  /**
   * Get proposals by account and status
   * @param {string} account
   * @param {number} [status=0]
   * @returns {Promise<Object>}
   */
  async getListByAccount(account, status = 0) {
    return this.proposalsHttp.getListByAccount(account, status);
  }

  /**
   * Get proposal
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.proposalsHttp.getOne(id);
  }

  /** @type {() => ProposalsService} */
  static getInstance = makeSingletonInstance(() => new ProposalsService());
}
