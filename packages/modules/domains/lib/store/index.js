import { arrayToTree } from 'performant-array-to-tree';

import { DisciplinesService } from '@deip/disciplines-service';

import {
  listGetter,
  oneGetter,
  setListMutation
} from '@deip/platform-fns';

import { collectionList } from '@deip/toolbox';

const domainsService = DisciplinesService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  topLevelList: (state) => (query = {}) => collectionList(state.data, { ...query, parentExternalId: '' }),
  one: oneGetter,
  tree: (state) => (query = {}) => {
    const array = collectionList(state.data, query);

    return arrayToTree(array, {
      id: 'externalId',
      parentId: 'parentExternalId',
      dataField: null
    });
  }
};

const ACTIONS = {
  getList({ commit }) {
    return domainsService.getAllDisciplines()
      .then((disciplines) => {
        commit('setList', disciplines);
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
