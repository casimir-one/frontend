import { UserService } from '@deip/user-service';

import {
  listGetter,
  setListMutationFactory,
} from '@deip/platform-fns';

const userService = UserService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false);
    }
    
    return userService.getNotificationsByUser(currentUser.username)
      .then((notifications) => {
        commit('setList', notifications);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  markAsRead({ commit, rootGetters }, notificationId) {
    const currentUser = rootGetters['currentUser/data'];
    if (!currentUser) {
      return Promise.resolve(false);
    }
    
    return userService
      .markUserNotificationAsRead(currentUser.username, notificationId)
      .then(() => {
        commit('remove', notificationId);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  remove: (state, notificationId) => {
    const index = state.data.findIndex(notification => notification.id === notificationId);
    if (index > -1) {
      state.data.splice(index, 1);
    }
  },
};

export const notificationsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
