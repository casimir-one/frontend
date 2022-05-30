import { ProjectContentService } from '@deip/project-content-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

const projectContentService = ProjectContentService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  async getList({ commit }) {
    const res = await projectContentService.getPublicContentList();
    commit('setList', res.data.items);
  },

  async getListByProjectId({ commit }, projectId) {
    const res = await projectContentService.getContentListByProject(projectId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, contentId) {
    const res = await projectContentService.getContent(contentId);
    commit('setOne', res.data);
  },

  async getListPaginated({ commit }, query) {
    const res = await projectContentService.getContentListPaginated(query);
    commit('setList', res.data.items);
    return res.data;
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const projectContentStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
