import { ReviewService } from '@deip/review-service';
import {
  listGetter,
  oneGetter,
  setListMutation
} from '@deip/platform-util';

const reviewsService = ReviewService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getRequestListByExpert({ commit }, payload) {
    return reviewsService.getRequestListByExpert(payload.username, payload.status)
      .then(({ data: { items: res } }) => {
        commit('setList', res);
      });
  },

  getRequestListByRequestor({ commit }, payload) {
    return reviewsService.getRequestListByRequestor(payload.username, payload.status)
      .then(({ data: { items: res } }) => {
        commit('setList', res);
      });
  },

  async createRequest(_, payload) {
    const res = await reviewsService.createRequest(payload);
    return res.data;
  }

};

const MUTATIONS = {
  setList: setListMutation
};

export const reviewRequestsRegistry = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
