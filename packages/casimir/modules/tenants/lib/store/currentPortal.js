import { PortalService } from '@deip/portal-service';
import { proxydi } from '@deip/proxydi';

const portalService = PortalService.getInstance();

const STATE = {
  data: null
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  get({ commit }) {
    return portalService.getPortal(proxydi.get('env').TENANT)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateProfile({ commit }, payload) {
    return portalService.updatePortalProfile(payload)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateNetworkSettings({ commit }, payload) {
    return portalService.updateNetworkSettings(payload)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateSettings({ commit }, payload) {
    return portalService.updatePortalSettings(payload)
      .then((result) => {
        commit('setData', result);
      });
  }
};

const MUTATIONS = {
  setData(state, payload) {
    state.data = payload;
  }
};

export const currentPortalStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
