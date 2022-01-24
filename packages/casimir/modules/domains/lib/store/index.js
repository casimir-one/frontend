import { arrayToTree } from 'performant-array-to-tree';

import { DomainsService } from '@deip/domains-service';

import {
  listGetter,
  oneGetter,
  setListMutation
} from '@deip/platform-store';

import { collectionList } from '@deip/toolbox';

const domainsService = DomainsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  topLevelList: (state) => (query = {}) => collectionList(state.data, { ...query, parentId: '' }),
  one: oneGetter,
  tree: (state) => (query = {}) => {
    const array = collectionList(state.data, query);

    return arrayToTree(array, {
      id: '_id',
      parentId: 'parentId',
      dataField: null
    });
  }
};

const ACTIONS = {
  getList({ commit }) {
    return domainsService.getAllDomains()
      .then((res) => {
        commit('setList', res.data.items);
      });
  }
};

const MUTATIONS = {
  setList: setListMutation
};

export const domainsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
