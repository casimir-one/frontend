import { TenantService } from '@deip/tenant-service';
import { proxydi } from '@deip/proxydi';

const tenantService = TenantService.getInstance();

const STATE = {
  data: null
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  get({ commit }) {
    return tenantService.getTenant(proxydi.get('env').TENANT)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateProfile({ commit }, payload) {
    return tenantService.updateTenantProfile(payload)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateNetworkSettings({ commit }, payload) {
    return tenantService.updateNetworkSettings(payload)
      .then((result) => {
        commit('setData', result);
      });
  },

  updateSettings({ commit }, payload) {
    return tenantService.updateTenantSettings(payload)
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

export const currentTenantStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
