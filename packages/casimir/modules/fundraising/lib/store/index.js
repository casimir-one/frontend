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
        shares,
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
        shares,
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

  getTokenSaleContributions({ commit, getters }, investmentOpportunityId) {
    return investmentsService.getInvestmentsHistoryByTokenSale(investmentOpportunityId)
      .then((contributions) => {
        const tokenSale = getters.one(investmentOpportunityId);
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
        investmentOpportunityId,
        investor,
        asset
      }
    } = payload;

    return investmentsService.investProjectTokenSale(
      { privKey },
      {
        investmentOpportunityId,
        investor,
        asset
      }
    );
  },

  getContributionsHistory({ commit }, userId) {
    return investmentsService.getAccountInvestmentsHistory(userId)
      .then((res) => {
        const investmentOpportunities = res.map((item) => item.investmentOpportunity);
        commit('setList', investmentOpportunities);
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
