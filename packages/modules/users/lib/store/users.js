import { UserService } from '@deip/user-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-fns';
import {
  createFormData,
  replaceFileWithName,
  hasValue
} from '@deip/toolbox';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'username' })
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    const methods = {
      users: 'getListByNames',
      teamId: 'getListByTeam',
      tenantId: 'getListByTenant',
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

  getListByTenant({ commit }, { tenantId }) {
    return userService.getUsersByTenant(tenantId)
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

  getOne({ commit }, username) {
    return userService.getUser(username)
      .then(({ account, profile }) => {
        commit('setOne', { username, account, profile });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  update({ dispatch, rootGetters }, payload) {
    const {
      user,
      data: {
        attributes,
        email,
        status,
        memoKey
      }
    } = payload;
    const formData = createFormData(payload.data.attributes);
    const updatedAttributes = replaceFileWithName(attributes);

    return userService.updateUser(user,
      {
        attributes: updatedAttributes,
        email,
        status,
        updater: user.username,
        memoKey,
        formData
      })
      .then(() => {
        dispatch('getOne', user.username);
        if (rootGetters['auth/username'] === user.username) {
          dispatch('currentUser/get', user.username, { root: true });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'username' }),
  setOne: setOneMutationFactory({ mergeKey: 'username' })
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
