import { BookmarkService } from '@deip/bookmark-service';

import {
  listGetter,
  setListMutation,
  removeFromListMutation
} from '@deip/platform-store';

const bookmarkService = BookmarkService.getInstance();

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

    return bookmarkService.getListByUsername(rootGetters['auth/username'])
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  add({ commit, rootGetters }, projectId) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    const payload = {
      username: rootGetters['auth/username'],
      projectId
    };

    return bookmarkService.create(payload)
      .then((bookmark) => {
        commit('add', bookmark);
      });
  },

  remove({ commit, rootGetters }, bookmarkId) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return bookmarkService.delete(rootGetters['auth/username'], bookmarkId)
      .then(() => {
        commit('remove', bookmarkId);
      });
  },

  clear({ commit }) {
    commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutation,
  add: (state, bookmark) => {
    state.data.push(bookmark);
  },
  remove: removeFromListMutation,
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
