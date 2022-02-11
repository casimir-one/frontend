import { ProjectContentService } from '@deip/project-content-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
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
  async getListByProjectId({ commit }, projectId) {
    const res = await projectContentService.getDraftsByProject(projectId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, id) {
    const res = await projectContentService.getDraft(id);
    commit('setOne', res.data);
  },

  async create(_, payload) {
    const {
      projectId,
      title,
      contentType,
      authors,
      references,
      formatType,
      files,
      jsonData
    } = payload;

    return projectContentService.createProjectContentDraft({
      projectId,
      title,
      contentType,
      authors,
      references,
      formatType,
      files,
      jsonData
    });
  },

  async update(_, payload) {
    return projectContentService.updateProjectContentDraft(payload);
  },

  async remove({ commit }, id) {
    await projectContentService.deleteProjectContentDraft(id);
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
    await projectContentService.createProjectContent(
      {
        initiator,
        proposalInfo: { isProposal: false },
        projectId,
        teamId,
        contentType,
        content: hash,
        title,
        hash,
        authors,
        references
      }
    );
    commit('remove', _id);
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
