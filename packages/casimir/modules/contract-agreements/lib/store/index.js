import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

import { ContractAgreementService } from '@deip/contract-agreement-service';
import { ProposalsService } from '@deip/proposals-service';

const contractAgreementService = ContractAgreementService.getInstance();
const proposalsService = ProposalsService.getInstance();

const convertPayloadForCreation = (payload) => {
  const {
    initiator: { privKey, username },
    data: {
      creator,
      hash,
      terms,
      parties,
      startTime,
      endTime,
      type,
      pdfContent
    }
  } = payload;
  return {
    initiator: { privKey, username },
    hash,
    creator,
    terms,
    parties,
    startTime,
    endTime,
    type,
    pdfContent
  };
};

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getOne({ commit }, id) {
    return contractAgreementService.getContractAgreement(id)
      .then((res) => {
        commit('setOne', res);
      });
  },

  getList({ commit }, query) {
    return contractAgreementService.getContractAgreements(query)
      .then((res) => {
        commit('setList', res);
      });
  },

  create(_, payload) {
    const data = convertPayloadForCreation(payload);
    return contractAgreementService.createContractAgreement(data);
  },

  propose(_, payload) {
    const data = convertPayloadForCreation(payload);
    return contractAgreementService.proposeContractAgreement(data);
  },

  discard(_, payload) {
    const {
      initiator,
      data: {
        proposalId,
        account
      }
    } = payload;

    return proposalsService.declineProposal(initiator, {
      proposalId,
      account
    });
  },

  accept(_, payload) {
    const {
      initiator,
      data: {
        contractAgreementId
      }
    } = payload;

    return contractAgreementService.acceptContractAgreement({ initiator, contractAgreementId });
  },

  acceptProposed(_, payload) {
    const {
      initiator,
      data: {
        proposalId,
        contractParty
      }
    } = payload;

    return proposalsService
      .acceptProposal(initiator, { proposalId, account: contractParty });
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const contractAgreementsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
