import {
  createFormData,
  createInstanceGetter
} from '@deip/toolbox';
import {
  CreateContractAgreementCmd,
  AcceptContractAgreementCmd,
  RejectContractAgreementCmd,
  CreateProposalCmd,
  AcceptProposalCmd
} from '@deip/commands';
import { APP_PROPOSAL } from '@deip/constants';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg, MultFormDataMsg } from '@deip/messages';
import { ContractAgreementHttp } from './ContractAgreementHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

/**
  * @typedef {{privKey: string, username: string}} Initiator
  */
export class ContractAgreementService {
  contractAgreementHttp = ContractAgreementHttp.getInstance();

  proxydi = proxydi;

  /**
   * Create contract agreement
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data.creator
   * @param {Object} payload.data.terms
   * @param {string} payload.data.hash
   * @param {Array.<string>} payload.data.parties
   * @param {number} payload.data.activationTime
   * @param {number} payload.data.expirationTime
   * @param {number} payload.data.type
   * @param {string} payload.data.pdfContent
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: { privKey, username },
      data: {
        creator = username,
        terms,
        hash,
        parties,
        activationTime,
        expirationTime = proposalDefaultLifetime,
        type,
        pdfContent
      }
    } = payload;

    const formData = createFormData(payload.data);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createContractAgreementCmd = new CreateContractAgreementCmd({
              creator,
              parties,
              hash,
              activationTime,
              expirationTime,
              type,
              terms,
              pdfContent
            });

            txBuilder.addCmd(createContractAgreementCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.contractAgreementHttp.create(msg);
          });
      });
  }

  /**
   * Accept contract agreement
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {string} payload.contractAgreementId
   * @returns {Promise<Object>}
   */
  async accept(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: party
      },
      contractAgreementId
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const acceptContractAgreementCmd = new AcceptContractAgreementCmd({
              entityId: contractAgreementId,
              party
            });
            txBuilder.addCmd(acceptContractAgreementCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.contractAgreementHttp.accept(msg);
          });
      });
  }

  /**
   * Reject contract agreement
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {string} payload.contractAgreementId
   * @returns {Promise<Object>}
   */
  async reject(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: party
      },
      contractAgreementId
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const rejectContractAgreementCmd = new RejectContractAgreementCmd({
              entityId: contractAgreementId,
              party
            });
            txBuilder.addCmd(rejectContractAgreementCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.contractAgreementHttp.reject(msg);
          });
      });
  }

  /**
   * Propose contract agreement
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data.creator
   * @param {Object} payload.data.terms
   * @param {string} payload.data.hash
   * @param {Array.<string>} payload.data.parties
   * @param {number} payload.data.activationTime
   * @param {number} payload.data.expirationTime
   * @param {number} payload.data.type
   * @param {string} payload.data.pdfContent
   * @returns {Promise<Object>}
   */
  async propose(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: { privKey, username },
      data: {
        creator = username,
        terms,
        hash,
        parties,
        activationTime,
        expirationTime = proposalDefaultLifetime,
        type,
        pdfContent
      }
    } = payload;

    const formData = createFormData(payload.data);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createContractAgreementCmd = new CreateContractAgreementCmd({
              creator,
              parties,
              hash,
              activationTime,
              expirationTime,
              type,
              terms,
              pdfContent
            });
            const contractAgreementId = createContractAgreementCmd.getProtocolEntityId();

            const acceptContractsCmds = parties.map((party) => new AcceptContractAgreementCmd({
              entityId: contractAgreementId,
              party
            }));

            const proposalBatch = [
              createContractAgreementCmd,
              ...acceptContractsCmds
            ];

            return chainTxBuilder.getBatchWeight(proposalBatch)
              .then((proposalBatchWeight) => {
                const createProposalCmd = new CreateProposalCmd({
                  creator,
                  type: APP_PROPOSAL.CONTRACT_AGREEMENT_PROPOSAL,
                  expirationTime,
                  proposedCmds: proposalBatch
                });
                txBuilder.addCmd(createProposalCmd);

                const createContractAgreementProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: createContractAgreementProposalId,
                  account: creator,
                  batchWeight: proposalBatchWeight
                });

                txBuilder.addCmd(updateProposalCmd);
                return txBuilder.end();
              });
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.contractAgreementHttp.create(msg);
          });
      });
  }

  /**
   * Get contract agreement list
   * @param {Object} obj
   * @param {Array.<string>} obj.parties
   * @param {number} obj.type
   * @param {number} obj.status
   * @param {string} obj.creator
   * @returns {Promise<Object>}
   */
  async getList({
    parties,
    type,
    status,
    creator
  } = {}) {
    const query = {
      parties: parties || [],
      type: type || '',
      status: status || '',
      creator: creator || ''
    };
    return this.contractAgreementHttp.getList(query);
  }

  /**
   * Get contract agreement by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.contractAgreementHttp.getOne(id);
  }

  /** @type {() => ContractAgreementService} */
  static getInstance = createInstanceGetter(ContractAgreementService);
}
