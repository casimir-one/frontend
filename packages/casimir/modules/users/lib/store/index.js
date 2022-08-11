import { UserService } from '@casimir/user-service';
import { USER_PROFILE_STATUS } from '@casimir/platform-core';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@casimir/platform-util';

import { hasValue } from '@casimir/toolbox';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    const methods = {
      users: 'getListByIds',
      teamId: 'getListByTeam',
      portalId: 'getListByPortal',
      status: 'getListByStatus'
    };

    for (const key of Object.keys(methods)) {
      if (hasValue(payload[key])) {
        return dispatch(methods[key], payload);
      }
    }

    return dispatch(methods.status, payload);
  },

  async getListByIds({ commit }, { users }) {
    const res = await userService.getListByIds(users);
    commit('setList', res.data.items);
  },

  async getListByTeam({ commit }, { teamId }) {
    const res = await userService.getListByTeam(teamId);
    commit('setList', res.data.items);
  },

  async getListByPortal({ commit }, { portalId }) {
    const res = await userService.getListByPortal(portalId);
    commit('setList', res.data.items);
  },

  async getListByStatus({ commit }, { status = USER_PROFILE_STATUS.APPROVED }) {
    const res = await userService.getList({ status });
    commit('setList', res.data.items);
  },

  // one

  async getOne({ commit }, id) {
    const res = await userService.getOne(id);
    commit('setOne', res.data);
  },

  async update({ dispatch, rootGetters }, payload) {
    const { _id } = payload;
    await userService.update(payload);
    dispatch('getOne', _id);
    if (rootGetters['auth/username'] === _id) {
      dispatch('currentUser/get', _id, { root: true });
    }
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
