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
    const {
      user: { privKey, username },
      data: {
        teamId,
        projectId,
        startTime,
        endTime,
        securityTokensOnSale,
        softCap,
        hardCap
      }, proposalInfo
    } = payload;

    return investmentsService.createProjectTokenSale(
      { privKey, username },
      {
        teamId,
        projectId,
        startTime,
        endTime,
        securityTokensOnSale,
        softCap,
        hardCap
      },
      proposalInfo
    );
  },

  getListByProjectId({ commit }, projectId) {
    return investmentsService.getProjectTokenSalesByProject(projectId)
      .then((tokenSales) => {
        commit('setList', tokenSales);
      });
  },

  getTokenSaleContributions({ commit, getters }, tokenSaleId) {
    return investmentsService.getProjectTokenSaleContributions(tokenSaleId)
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
      user: { privKey },
      data: {
        tokenSaleId,
        contributor,
        amount
      }
    } = payload;

    return investmentsService.contributeProjectTokenSale(
      { privKey },
      {
        tokenSaleId,
        contributor,
        amount
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
