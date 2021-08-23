import { InvestmentsService } from '@deip/investments-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

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
        hardCap,
        title,
        metadata
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
        hardCap,
        title,
        metadata
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
    return investmentsService.getInvestmentsHistoryByTokenSale(tokenSaleId)
      .then((contributions) => {
        const tokenSale = getters.one(tokenSaleId);
        commit('setOne', {
          ...tokenSale,
          contributions
        });
      });
  },

  getCurrentTokenSaleByProject({ commit }, projectId) {
    return investmentsService.getCurrentTokenSaleByProject(projectId)
      .then((tokenSale) => {
        commit('setOne', tokenSale);
        return tokenSale;
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

    return investmentsService.investProjectTokenSale(
      { privKey },
      {
        tokenSaleId,
        investor: contributor,
        amount
      }
    );
  },

  getContributionsHistory({ commit }, username) {
    return investmentsService.getAccountInvestmentsHistory(username)
      .then((res) => {
        const tokenSales = res.map((item) => item.tokenSale);
        commit('setList', tokenSales);
        return res;
      });
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
