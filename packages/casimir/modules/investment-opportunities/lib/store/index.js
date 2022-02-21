import { InvestmentOpportunityService } from '@deip/investment-opportunity-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

const investmentOpportunityService = InvestmentOpportunityService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  one: oneGetter,
  list: listGetter
};

const ACTIONS = {
  create(_, payload) {
    return investmentOpportunityService.create(payload);
  },

  getListByProjectId({ commit }, projectId) {
    return investmentOpportunityService.getListByProject(projectId)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getInvestmentOpportunityInvestments({ commit, getters }, investmentOpportunityId) {
    return investmentOpportunityService
      .getInvestmentOpportunityHistoryById(investmentOpportunityId)
      .then((res) => {
        const investmentOpportunity = getters.one(investmentOpportunityId);
        commit('setOne', {
          ...investmentOpportunity,
          investments: res.data.items
        });
      });
  },

  getCurrentInvestmentOpportunityByProject({ commit }, projectId) {
    return investmentOpportunityService.getCurrentInvestmentOpportunityByProject(projectId)
      .then((res) => {
        commit('setOne', res.data);
        return res.data;
      });
  },

  invest(_, payload) {
    return investmentOpportunityService.invest(payload);
  },

  getInvestmentsHistory({ commit }, userId) {
    return investmentOpportunityService.getAccountInvestmentOpportunityHistory(userId)
      .then((res) => {
        const investmentOpportunities = res.data.items.map((item) => item.investmentOpportunity);
        commit('setList', investmentOpportunities);
        return res.data.items;
      });
  }
};

const MUTATIONS = {
  setOne: setOneMutation,
  setList: setListMutation
};

export const investmentOpportunitiesStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
