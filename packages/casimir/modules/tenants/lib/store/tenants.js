import { TenantService } from '@deip/tenant-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-store';

const tenantService = TenantService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'id' })
};

const ACTIONS = {
  getList({ commit }) {
    return tenantService.getNetworkTenants()
      .then((result) => {
        commit('setList', result);
      });
  },

  getOne({ commit }, tenantId) {
    return tenantService.getNetworkTenant(tenantId)
      .then((result) => {
        commit('setOne', result);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  setOne: setOneMutationFactory({ mergeKey: 'id' })
};

export const tenantsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
