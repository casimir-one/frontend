import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-store';

import { ContractAgreementService } from '@deip/contract-agreement-service';
import { ProposalsService } from '@deip/proposals-service';
import { genSha256Hash } from '@deip/toolbox';

const contractAgreementService = ContractAgreementService.getInstance();
const proposalsService = ProposalsService.getInstance();

const convertPayloadForCreation = (payload) => {
  const {
    initiator: { privKey, username },
    data: {
      file,
      terms,
      parties,
      startTime,
      endTime,
      type
    }
  } = payload;
  const hash = genSha256Hash(file.name);

  return {
    initiator: { privKey, username },
    hash,
    terms: { ...terms, filename: file.name },
    parties,
    startTime,
    endTime,
    type
  };
};

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: '_id' })
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

  getListByCreator({ commit }, id) {
    return contractAgreementService.getContractAgreementsListByCreator(id)
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
      account,
      authorityType: 2
    });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: '_id' }),
  setOne: setOneMutationFactory({ mergeKey: '_id' })
};

export const contractAgreementsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
