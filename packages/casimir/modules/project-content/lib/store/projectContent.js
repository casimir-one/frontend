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
    const contentList = await projectContentService.getPublicProjectContentListing();
    commit('setList', contentList);
  },

  async getListByProjectId({ commit }, projectId) {
    const contentList = await projectContentService.getProjectContentsByProject(projectId);
    commit('setList', contentList);
  },

  async getOne({ commit }, contentId) {
    const content = await projectContentService.getProjectContent(contentId);
    commit('setOne', content);
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
