import { InvestmentsService } from '@deip/investments-service';
import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-store';

const investmentsService = InvestmentsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  one: oneGetterFactory({ selectorKey: '_id' }),
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
  setOne: setOneMutationFactory({ mergeKey: '_id' }),
  setList: setListMutationFactory({ mergeKey: '_id' })
};

export const fundraisingStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
