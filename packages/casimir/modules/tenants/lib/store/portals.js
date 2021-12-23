import { PortalService } from '@deip/portal-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

const portalService = PortalService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ commit }) {
    return portalService.getNetworkPortals()
      .then((result) => {
        commit('setList', result);
      });
  },

  getOne({ commit }, portalId) {
    return portalService.getNetworkPortal(portalId)
      .then((result) => {
        commit('setOne', result);
      });
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const portalsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
