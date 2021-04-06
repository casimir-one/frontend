import { UserService } from '@deip/user-service';

import {
  listGetter,
  setListMutationFactory,
} from '@deip/platform-fns';

import { camelizeObjectKeys } from '@deip/toolbox';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false)
    }

    return userService.getResearchBookmarks(currentUser.username)
      .then((bookmarks) => {
        commit('setList', bookmarks);
      })
  },

  add({ commit, rootGetters }, projectId) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false);
    }

    return userService.createResearchBookmark(currentUser.username, projectId)
      .then((bookmark) => {
        commit('add', bookmark);
      })
  },

  remove({ commit, rootGetters }, bookmarkId) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false);
    }

    return userService.removeResearchBookmark(currentUser.username, bookmarkId)
      .then(() => {
        commit('remove', bookmarkId);
      })
  },

  clear({ commit }) {
    return commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  add: (state, bookmark) => {
    state.data.push(camelizeObjectKeys(bookmark));
  },
  remove: (state, bookmarkId) => {
    const index = state.data.findIndex(bookmark => bookmark.id === bookmarkId);
    if (index > -1) {
      state.data.splice(index, 1);
    }
  },
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
}
