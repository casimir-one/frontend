import { AssetsService } from '@deip/assets-service';

import {
  listGetter,
  setListMutationFactory
} from '@deip/platform-fns';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false);
    }

    return assetsService.getAccountAssetsBalancesByOwner(currentUser.username)
      .then((balances) => {
        commit('setList',
          balances.filter((balance) => !balance.tokenized_research));
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' })
};

export const currentUserBalancesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};