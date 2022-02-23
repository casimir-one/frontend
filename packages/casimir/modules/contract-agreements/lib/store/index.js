import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

import { ContractAgreementService } from '@deip/contract-agreement-service';
import { ProposalsService } from '@deip/proposals-service';

const contractAgreementService = ContractAgreementService.getInstance();
const proposalsService = ProposalsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getOne({ commit }, id) {
    return contractAgreementService.getOne(id)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  getList({ commit }, query) {
    return contractAgreementService.getList(query)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  create(_, payload) {
    return contractAgreementService.create(payload);
  },

  propose(_, payload) {
    return contractAgreementService.propose(payload);
  },

  discard(_, payload) {
    return proposalsService.decline(payload);
  },

  accept(_, payload) {
    const {
      initiator,
      data: {
        contractAgreementId
      }
    } = payload;

    return contractAgreementService.accept({ initiator, contractAgreementId });
  },

  acceptProposed(_, payload) {
    return proposalsService.accept(payload);
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
