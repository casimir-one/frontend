import { InvestmentsService } from '@deip/investments-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  one: oneGetter,
  list: listGetter
};

const ACTIONS = {
  create(_, payload) {
    return investmentsService.createResearchTokenSale(...payload);
  },

  getListByProjectId({ commit }, projectId) {
    return investmentsService.getResearchTokenSalesByResearch(projectId)
      .then((tokenSales) => {
        commit('setList', tokenSales);
      });
  },

  getTokenSaleContributions({ commit, getters }, tokenSaleId) {
    return investmentsService.getResearchTokenSaleContributions(tokenSaleId)
      .then((contributions) => {
        const tokenSale = getters.one(tokenSaleId);
        commit('setOne', {
          ...tokenSale,
          contributions
        });
      });
  },

  contribute(_, payload) {
    const {
      user: { privKey, username },
      data: {
        tokenSaleExternalId,
        contributor,
        amount
      }
    } = payload;

    return investmentsService.contributeResearchTokenSale(
      { privKey, username },
      {
        tokenSaleExternalId,
        contributor,
        amount,
        extensions: []
      }
    );
  }
};

const MUTATIONS = {
  setOne: setOneMutation,
  setList: setListMutation
};

export const fundraisingStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
