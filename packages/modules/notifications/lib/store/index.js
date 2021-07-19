import { NotificationService } from '@deip/notification-service';

import {
  listGetter,
  setListMutationFactory,
  removeFromListMutationFactory
} from '@deip/platform-store';

const notificationService = NotificationService.getInstance();

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

    return notificationService.getNotificationsByUser(rootGetters['auth/username'])
      .then((notifications) => {
        commit('setList', notifications);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  markAsRead({ commit, rootGetters }, notificationId) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return notificationService
      .markUserNotificationAsRead(rootGetters['auth/username'], notificationId)
      .then(() => {
        commit('remove', notificationId);
      });
  },

  clear({ commit }) {
    commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  remove: removeFromListMutationFactory({ mergeKey: 'id' }),
  clear: (state) => {
    state.data = [];
  }
};

export const notificationsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
