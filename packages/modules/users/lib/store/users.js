import { UsersService } from '@deip/users-service';

import {
  listGetter,
  oneGetterFabric,
  setListMutationFabric,
  setOneMutationFabric
} from '@deip/platform-fns/lib/store';

const usersService = UsersService.getInstance();


const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFabric({ selectorKey: 'username' })
};

const ACTIONS = {
  get({ commit }) {
    return usersService.getUsersListing()
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getOne({ commit }, username) {
    return usersService.getUser(username)
      .then(({ account, profile }) => {
        commit('setOne', { username, account, profile });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFabric({ mergeKey: 'username' }),
  setOne: setOneMutationFabric({ mergeKey: 'username' })
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
