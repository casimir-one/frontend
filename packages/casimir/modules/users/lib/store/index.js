import { UserService } from '@deip/user-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

import { hasValue } from '@deip/toolbox';

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
      users: 'getListByNames',
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

  getListByNames({ commit }, { users }) {
    return userService.getUsers(users)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByTeam({ commit }, { teamId }) {
    return userService.getUsersByTeam(teamId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByPortal({ commit }, { portalId }) {
    return userService.getUsersByPortal(portalId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByStatus({ commit }, { status = 'approved' }) {
    return userService.getUsersListing(status)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // one

  getOne({ commit }, id) {
    return userService.getUser(id)
      .then((user) => {
        commit('setOne', user);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  update({ dispatch, rootGetters }, payload) {
    const { _id } = payload;
    return userService.updateUser(payload)
      .then(() => {
        dispatch('getOne', _id);
        if (rootGetters['auth/username'] === _id) {
          dispatch('currentUser/get', _id, { root: true });
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
