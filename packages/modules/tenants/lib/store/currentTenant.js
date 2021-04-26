import { TenantService } from '@deip/tenant-service';

const tenantService = TenantService.getInstance();

const STATE = {
  tenant: null
};

const GETTERS = {
  data: (state) => state.tenant
}

const ACTIONS = {
  get({ commit }, tenantId) {
    return tenantService.getTenant(tenantId)
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
    state.tenant = payload;
  }
};

export const currentTenantStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
