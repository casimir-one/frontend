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
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getInvestmentOpportunityInvestments({ commit, getters }, investmentOpportunityId) {
    return investmentsService.getInvestmentsHistoryByTokenSale(investmentOpportunityId)
      .then((res) => {
        const investmentOpportunity = getters.one(investmentOpportunityId);
        commit('setOne', {
          ...investmentOpportunity,
          investments: res.data.items
        });
      });
  },

  getCurrentInvestmentOpportunityByProject({ commit }, projectId) {
    return investmentsService.getCurrentTokenSaleByProject(projectId)
      .then((res) => {
        commit('setOne', res.data);
        return res.data;
      });
  },

  invest(_, payload) {
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

  getInvestmentsHistory({ commit }, userId) {
    return investmentsService.getAccountInvestmentsHistory(userId)
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

export const fundraisingStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
