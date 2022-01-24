import { ProjectContentService } from '@deip/project-content-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

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
    const res = await projectContentService.getPublicProjectContentListing();
    commit('setList', res.data.items);
  },

  async getListByProjectId({ commit }, projectId) {
    const res = await projectContentService.getProjectContentsByProject(projectId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, contentId) {
    const res = await projectContentService.getProjectContent(contentId);
    commit('setOne', res.data);
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
