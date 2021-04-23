import { InvestmentsService } from '@deip/investments-service';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {};

const ACTIONS = {
  create(_, payload) {
    return investmentsService.createResearchTokenSale(...payload);
  }
};

const MUTATIONS = {};

export const fundraisingStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
