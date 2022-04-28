import { ReviewService } from '@deip/review-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
} from '@deip/platform-util';
import { getAdditionalData, getAdditionalDataOne } from '../utils/getAdditionalData';

const reviewsService = ReviewService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  async create({ dispatch }, payload) {
    const res = await reviewsService.createReview(payload);
    dispatch('getReviewDetails', res.data._id);

    return res.data;
  },

  rejectReviewRequest(_, requestDataId) {
    return reviewsService.declineRequest(requestDataId);
  },

  getReviewDetails({ commit }, reviewId) {
    return reviewsService.getOne(reviewId)
      .then(({ data: item }) => getAdditionalDataOne(item)
        .then((res) => {
          commit('setOne', res);
        }));
  },

  getReviewsByProject({ commit }, projectId) {
    return reviewsService.getListByProject(projectId)
      .then(({ data: { items } }) => getAdditionalData(items)
        .then((res) => {
          commit('setList', res);
        }));
  },

  getReviewsByContent({ commit }, contentId) {
    return reviewsService.getListByProjectContent(contentId)
      .then(({ data: { items } }) => getAdditionalData(items)
        .then((res) => {
          commit('setList', res);
        }));
  },
  upvoteReview(_, payload) {
    return reviewsService.upvote(payload);
  }

};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  remove: removeFromListMutation
};

export const reviewsRegistry = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
