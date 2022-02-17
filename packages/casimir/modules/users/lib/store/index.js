import { UserService } from '@deip/user-service';
import { USER_PROFILE_STATUS } from '@deip/constants';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

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
    return userService.getListByIds(users)
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByTeam({ commit }, { teamId }) {
    return userService.getListByTeam(teamId)
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByPortal({ commit }, { portalId }) {
    return userService.getListByPortal(portalId)
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByStatus({ commit }, { status = USER_PROFILE_STATUS.APPROVED }) {
    return userService.getList({ status })
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // one

  getOne({ commit }, id) {
    return userService.getOne(id)
      .then((res) => {
        commit('setOne', res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  update({ dispatch, rootGetters }, payload) {
    const { _id } = payload;
    return userService.update(payload)
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
