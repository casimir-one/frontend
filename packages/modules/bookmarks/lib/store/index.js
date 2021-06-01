import { UserService } from '@deip/user-service';

import {
  listGetter,
  setListMutationFactory,
  removeFromListMutationFactory
} from '@deip/platform-fns';

import { camelizeObjectKeys } from '@deip/toolbox';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return userService.getResearchBookmarks(rootGetters['auth/username'])
      .then((bookmarks) => {
        commit('setList', bookmarks);
      });
  },

  add({ commit, rootGetters }, projectId) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return userService.createResearchBookmark(rootGetters['auth/username'], projectId)
      .then((bookmark) => {
        commit('add', bookmark);
      });
  },

  remove({ commit, rootGetters }, bookmarkId) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return userService.removeResearchBookmark(rootGetters['auth/username'], bookmarkId)
      .then(() => {
        commit('remove', bookmarkId);
      });
  },

  clear({ commit }) {
    commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  add: (state, bookmark) => {
    state.data.push(camelizeObjectKeys(bookmark));
  },
  remove: removeFromListMutationFactory({ mergeKey: 'id' }),
  clear: (state) => {
    state.data = [];
  }
};

export const bookmarksStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
