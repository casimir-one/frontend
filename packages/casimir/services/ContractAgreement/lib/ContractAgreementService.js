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

export class ContractAgreementService {
  contractAgreementHttp = ContractAgreementHttp.getInstance();

  proxydi = proxydi;

  async create(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: { privKey, username },
      ...data
    } = payload;

    const {
      creator = username,
      terms,
      hash,
      parties,
      activationTime,
      expirationTime = proposalDefaultLifetime,
      type,
      pdfContent
    } = data;

    const formData = createFormData(data);

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
            return this.contractAgreementHttp.create(msg);
          });
      });
  }

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
            return this.contractAgreementHttp.accept(msg);
          });
      });
  }

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
            return this.contractAgreementHttp.reject(msg);
          });
      });
  }

  async propose(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: { privKey, username },
      ...data
    } = payload;

    const {
      creator = username,
      terms,
      hash,
      parties,
      activationTime,
      expirationTime = proposalDefaultLifetime,
      type,
      pdfContent
    } = data;

    const formData = createFormData(data);

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

            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.CONTRACT_AGREEMENT_PROPOSAL,
              expirationTime,
              proposedCmds: [createContractAgreementCmd, ...acceptContractsCmds]
            });

            txBuilder.addCmd(createProposalCmd);

            const createContractAgreementProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new AcceptProposalCmd({
              entityId: createContractAgreementProposalId,
              account: creator
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload());
            return this.contractAgreementHttp.create(msg);
          });
      });
  }

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

  async getOne(id) {
    return this.contractAgreementHttp.getOne(id);
  }

  /** @type {() => ContractAgreementService} */
  static getInstance = createInstanceGetter(ContractAgreementService);
}
