import { ProjectContentService } from '@deip/project-content-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
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
  async getListByProjectId({ commit }, projectId) {
    const res = await projectContentService.getDraftsByProject(projectId);
    commit('setList', res.data.items);
  },

  async getListPaginated({ commit }, query) {
    const res = await projectContentService.getDraftsListPaginated(query);
    commit('setList', res.data.items);
    return res.data;
  },

  async getOne({ commit }, id) {
    const res = await projectContentService.getDraft(id);
    commit('setOne', res.data);
  },

  async create(_, payload) {
    return projectContentService.createDraft(payload);
  },

  async update(_, payload) {
    return projectContentService.updateDraft(payload);
  },

  async remove({ commit }, id) {
    await projectContentService.deleteDraft(id);
    commit('remove', id);
  },

  async publish({ commit }, payload) {
    const {
      initiator,
      data: {
        _id,
        projectId,
        teamId,
        contentType,
        title,
        authors,
        references,
        hash
      }
    } = payload;

    await projectContentService.createContent(
      {
        initiator,
        data: {
          _id,
          projectId,
          teamId,
          contentType,
          title,
          authors,
          references,
          hash,
          content: hash
        },
        proposalInfo: { isProposal: false }
      }
    );
    commit('remove', _id);
  },

  moderate(_, payload) {
    return projectContentService.moderateProjectContentDraft(payload);
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  remove: removeFromListMutation
};

export const projectContentDraftsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
